

let source, big;
let radialGrad = false, RG, isRG, startValue = 60 * 60 * 10, idleCounter = startValue, colorCount1, colorCount2, c1 = 155, c2 = 200;
let scaleFactor = 10, isBW = false, BW;
let posX, posY, prevVal1, prevVal2, prevFac, prevLev, prevPixSize = 0;
let posMouseX, posMouseY;
let input, button, saveTxt, changeKernel, genDither, slider1, slider2, pixSize, slidFac, slidLev;
let ker = [];
let fac = 16, lev = 1;
let ditherKernels = [];

let di;
let childDither = false;

initDitherKernels();

function setup(){
  pixelDensity(1);
  let w = floor(window.innerWidth / 10) * 10;
  let h = floor(window.innerHeight / 10) * 10;
  let cnv = createCanvas(w, h);
  posX = abs((window.innerWidth / 2) - (width / 2));
  posY = 0;
  cnv.position(posX, posY);
  //image init 
  source = createImage(floor(width / scaleFactor), floor(height / scaleFactor));
  di = new ditherImage(0, 0, w, h, true, source);
  updateValue();
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyCbAxda4yvrLEdjR3fcVgbU9ms04ek7tNI",
    authDomain: "dither-b578e.firebaseapp.com",
    databaseURL: "https://dither-b578e.firebaseio.com",
    projectId: "dither-b578e",
    storageBucket: "",
    messagingSenderId: "827206455788"
  };
  firebase.initializeApp(config);
  console.log(firebase);
}

function draw(){
  if(idleCounter <= 0){
    idleCounter = 0;
    if(frameCount % 60 == 0)idleMode(colorCount1, colorCount2);
  }
  idleCounter --;
}

//save image function
function saveImg() {
  let saveTxt = "I_❤️_DITHERS";
  di.saveImg(saveTxt, col1, col2, scaleFactor, fac, lev, ker, radialGrad);
}

function blackAndWhite(){
  idleCounter = startValue;//reset the idlecounter to exit idleMode
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
  isBW = !isBW;
  let val1 = floor(document.getElementById("color1").value);
  let val2 = floor(document.getElementById("color2").value);
  console.log(val1, val2);
  if(isBW){
    col1 = color(val1);
    col2 = color(val2);
  }else{
    colorMode(HSB);
    col1 = color(val1, 100, 100);
    col2 = color(val2, 100, 100);
    colorMode(RGB);
  }
  generateDither();
}

function makeRadialGradient(){
  idleCounter = startValue;//reset the idlecounter to exit idleMode
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
  radialGrad = !radialGrad;
  di.update(col1, col2, fac, lev, ker, scaleFactor, radialGrad);
  di.show();
}

function idleMode(num1, num2){
  //add random kernel
  //and let the timing be 10 min or check with boris
  console.log('idle')
  scaleFactor = 10;
  c1 -= colorCount1;
  c2 += colorCount2;
  if(isBW){ 
    col1 = color(c1 % 255);
    col2 = color(c2 % 255);
  }else{
    colorMode(HSB);
    col1 = color(c1 % 255, 100, 100);
    col2 = color(c2 % 255, 100, 100);
    colorMode(RGB);
  }
  generateDither();
}

function personalDither(){
  console.log('go');
  let matrix = [];
  let i = 1
  for (let y =  0; y < 3; y++) {
    matrix[y] = [];
    for (let x = 0; x < 3; x++) {
      let matrixVal = document.getElementById("k" + i).value;
      if(isNaN(matrixVal) || matrixVal == '') matrixVal = floor(random(100));
      else matrixVal = parseInt(matrixVal);
      matrix[y][x] = matrixVal;
      //matrix.push(matrixVal);
      i++;
    }
  }
  ker = matrix;
  generateDither();
  //console.log(matrix);
}

function whichKernel(){
  let select = document.getElementById("kernel");
  let answer = select.options[select.selectedIndex].value;
  if(ditherKernels != null){
    for(let i = 0; i < ditherKernels.length; i++){
      if(answer == ditherKernels[i].Name){
        ker = ditherKernels[i].Kernel;
        break;
      }
    }
  }
  generateDither();
//console.log(answer);
}

function generateDither(){
  //console.log(di);
  di.update(col1, col2, fac, lev, ker, scaleFactor, radialGrad);
  di.show();
}

function updateValue(){  
  scaleFactor = floor(document.getElementById("pixSize").value);
  let val1 = floor(document.getElementById("color1").value);
  let val2 = floor(document.getElementById("color2").value);
  if(isBW){
    col1 = color(val1);
    col2 = color(val2);
  }else{
    colorMode(HSB);
    col1 = color(val1, 100, 100);
    col2 = color(val2, 100, 100);
    colorMode(RGB);
  }
  fac = document.getElementById("factor").value;
  generateDither();
  idleCounter = startValue;//reset the idlecounter to exit idleMode
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
}

function setPosition(){
  let items = document.getElementsByClassName("ditinput");
  for(let i = 0; i < items.length; i++){
    items[i].style.left = 10 + "px";
  }    
  let sliders = document.getElementsByClassName("sliders");
  for(let i = 0; i < sliders.length; i++){
    sliders[i].style.left = 10 + "px";
  }
  let elements = document.getElementsByClassName("kernels");
  for(let i = 0; i < elements.length; i++){
    elements[i].style.left = 10 + "px";
  }
  let info = document.getElementsByClassName("infobtn");
  for(let i = 0; i < info.length; i++){
    info[i].style.left = 15 + "px";
  }
}

function ditherKernel(name, kernel){
  this.Name = name;
  this.Kernel = kernel;
}

function initDitherKernels(){
  let kernelName = ['STEINBERG', 'LINEARRANDOM', 'FALSESTEINBERG', 'PARTIALBURKE', 'INVERTEDSTEINBERG',
  'SLANTED', 'COOL01', 'COOL02', 'COOL03', 'COOL04', 'COOL05', 'COOL06', 'CHRIS', 'STRUCTURE'];
  let STEINBERG = [[0.0, 0.0, 0.0 ], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
  let LINEARRANDOM = [[0, 3.0, 0], [ 5.0, 0, 1.0], [0, 7.0, 0]];///linear 2
  let FALSESTEINBERG = [[0, 0, 0], [0, 0, 3.0], [0, 3.0, 2.0]];///false seinberg factor 8 4
  let PARTIALBURKE = [[0, 0, 0], [0, 0, 8.0], [4.0, 8.0, 4.0]];//part of burke factor 32 // really nice at low  factor 3.9 and level 2
  let INVERTEDSTEINBERG = [[1.0, 5.0, 3.0], [7.0, 0, 0], [0, 0, 0]];//8
  let SLANTED = [[8.0, 0, 9.0], [3.0, 8.0, 2.0], [4.0, 0, 0]];//10
  let COOL01 = [[0, 5.0, 0], [0, 0, 1.0], [3.0, 0, 7.0]];///coool kernel 1
  let COOL02 = [[0, 0, 0], [5.0, 0, 3.0], [ 7.0, 0, 0]];///cool 2 3
  let COOL03 = [[4.0, 9.0, 0.0], [6.0, 2.0, 9.0], [0, 3.0, 0]];//11
  let COOL04 = [[0, 0, 3.0], [8.0, 0, 4.0], [2.0, 6.0, 1.0]];//12
  let COOL05 = [[0.0, 9.0, 6.0], [9.0, 0.0, 6.0], [1.0, 6.0, 0.0]];//13
  let COOL06 = [[7.0, 0.0, 7.0], [0.0, 6.0, 3.0], [0.0, 4.0, 6.0]];//14
  let CHRIS = [[0.0, 0.0, 1.0], [0.0, 0.0, 4.0], [7.0, 4.0, 2.0]];//15
  let STRUCTURE = [[1.0, 0, 0], [7.0, 0, 6.0], [0, 2.0, 0]];///really nice structure
  let kernels = [STEINBERG, LINEARRANDOM, FALSESTEINBERG, PARTIALBURKE, INVERTEDSTEINBERG,
  SLANTED, COOL01, COOL02, COOL03, COOL04, COOL05, COOL06, CHRIS, STRUCTURE];
  //creating the array with the kernels
  for(let i = 0; i < kernels.length; i++){
    let ditKer = new ditherKernel(kernelName[i], kernels[i]);
    ditherKernels.push(ditKer);
  }
  ker = STEINBERG;
}