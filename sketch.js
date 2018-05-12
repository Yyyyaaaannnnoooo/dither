let source, big;
let radialGrad = false, RG, isRG, startValue = 60, idleCounter = startValue, colorCount1 = 1, colorCount2 = 1, c1 = 155, c2 = 200;
let scaleFactor = 10, isBW = false, BW;
let posX, posY, prevVal1, prevVal2, prevFac, prevLev, prevPixSize = 0;
let posMouseX, posMouseY;
let input, button, saveTxt, changeKernel, genDither, slider1, slider2, pixSize, slidFac, slidLev;
let ker = [];
let fac = 16, lev = 1;
let ditherKernels = [];

let dither;
let childDither = false;

initDitherKernels();

function setup() {
  pixelDensity(1);
  let w = floor(window.innerWidth / 10) * 10;
  let h = floor(window.innerHeight / 10) * 10;
  let cnv = createCanvas(w, h);
  posX = abs((window.innerWidth / 2) - (width / 2));
  posY = 0;
  cnv.position(posX, posY);
  //image init 

  dither = new Dither();
  dither.generateDither();
  colorCount1 = floor(random(3));
  colorCount2 = floor(random(3));
}
//ADD IDLE MODE!
function draw() {
  image(dither.getDither(), 0, 0);
  // if (idleCounter <= 0) {
  //   idleCounter = 0;
  //   if (frameCount % 60 == 0) idleMode(colorCount1, colorCount2);
  // }
  // idleCounter--;
}
function windowResized(){
  let w = floor(window.innerWidth / 10) * 10;
  let h = floor(window.innerHeight / 10) * 10;
  resizeCanvas(w, h);
  dither.setSize(w, h);
}
//save image function
function saveImg() {
  let saveTxt = "I_❤️_DITHERS";
  dither.saveImg(saveTxt);
}

function idleMode(num1, num2) {
  //add random kernel
  //and let the timing be 10 min or check with boris
  console.log('idle')
  c1 -= colorCount1;
  c2 += colorCount2;
  dither.setColor(c1, c2);
}

function whichKernel() {
  let select = document.getElementById("kernel");
  let answer = select.options[select.selectedIndex].value;
  let inputKernel;
  if (ditherKernels != null) {
    for (let i = 0; i < ditherKernels.length; i++) {
      if (answer == ditherKernels[i].Name) {
        inputKernel = ditherKernels[i].Kernel;
        break;
      }
    }
  }
  dither.setKernel(inputKernel);
  //console.log(answer);
}


function ditherKernel(name, kernel) {
  this.Name = name;
  this.Kernel = kernel;
}

function initDitherKernels() {
  let kernelName = ['STEINBERG', 'LINEARRANDOM', 'FALSESTEINBERG', 'PARTIALBURKE', 'INVERTEDSTEINBERG',
    'SLANTED', 'COOL01', 'COOL02', 'COOL03', 'COOL04', 'COOL05', 'COOL06', 'CHRIS', 'STRUCTURE'];
  let STEINBERG = [[0.0, 0.0, 0.0], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
  let LINEARRANDOM = [[0, 3.0, 0], [5.0, 0, 1.0], [0, 7.0, 0]];///linear 2
  let FALSESTEINBERG = [[0, 0, 0], [0, 0, 3.0], [0, 3.0, 2.0]];///false seinberg factor 8 4
  let PARTIALBURKE = [[0, 0, 0], [0, 0, 8.0], [4.0, 8.0, 4.0]];//part of burke factor 32 // really nice at low  factor 3.9 and level 2
  let INVERTEDSTEINBERG = [[1.0, 5.0, 3.0], [7.0, 0, 0], [0, 0, 0]];//8
  let SLANTED = [[8.0, 0, 9.0], [3.0, 8.0, 2.0], [4.0, 0, 0]];//10
  let COOL01 = [[0, 5.0, 0], [0, 0, 1.0], [3.0, 0, 7.0]];///coool kernel 1
  let COOL02 = [[0, 0, 0], [5.0, 0, 3.0], [7.0, 0, 0]];///cool 2 3
  let COOL03 = [[4.0, 9.0, 0.0], [6.0, 2.0, 9.0], [0, 3.0, 0]];//11
  let COOL04 = [[0, 0, 3.0], [8.0, 0, 4.0], [2.0, 6.0, 1.0]];//12
  let COOL05 = [[0.0, 9.0, 6.0], [9.0, 0.0, 6.0], [1.0, 6.0, 0.0]];//13
  let COOL06 = [[7.0, 0.0, 7.0], [0.0, 6.0, 3.0], [0.0, 4.0, 6.0]];//14
  let CHRIS = [[0.0, 0.0, 1.0], [0.0, 0.0, 4.0], [7.0, 4.0, 2.0]];//15
  let STRUCTURE = [[1.0, 0, 0], [7.0, 0, 6.0], [0, 2.0, 0]];///really nice structure
  let kernels = [STEINBERG, LINEARRANDOM, FALSESTEINBERG, PARTIALBURKE, INVERTEDSTEINBERG,
    SLANTED, COOL01, COOL02, COOL03, COOL04, COOL05, COOL06, CHRIS, STRUCTURE];
  //creating the array with the kernels
  for (let i = 0; i < kernels.length; i++) {
    let ditKer = new ditherKernel(kernelName[i], kernels[i]);
    ditherKernels.push(ditKer);
  }
  ker = STEINBERG;
}
