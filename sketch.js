function ditherKernel(name, kernel){
  this.Name = name;
  this.Kernel = kernel;
}

var source, big;
var scaleFactor = 10;
var posX, posY, prevVal1, prevVal2, prevFac, prevLev, isBW = false;
var posMouseX, posMouseY;
var input, button, saveTxt, changeKernel, genDither, slider1, slider2, pixSize, slidFac, slidLev, BW;
var ker = [];
var fac = 16, lev = 1;
var ditherKernels = [];
var kernelName = ['STEINBERG', 'LINEARRANDOM', 'FALSESTEINBERG', 'PARTIALBURKE', 'INVERTEDSTEINBERG',
                  'SLANTED', 'COOL01', 'COOL02', 'COOL03', 'COOL04', 'COOL05', 'COOL06', 'CHRIS', 'STRUCTURE'];
var STEINBERG = [[0.0, 0.0, 0.0 ], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
var LINEARRANDOM = [[0, 3.0, 0], [ 5.0, 0, 1.0], [0, 7.0, 0]];///linear 2
var FALSESTEINBERG = [[0, 0, 0], [0, 0, 3.0], [0, 3.0, 2.0]];///false seinberg factor 8 4
var PARTIALBURKE = [[0, 0, 0], [0, 0, 8.0], [4.0, 8.0, 4.0]];//part of burke factor 32 // really nice at low  factor 3.9 and level 2
var INVERTEDSTEINBERG = [[1.0, 5.0, 3.0], [7.0, 0, 0], [0, 0, 0]];//8
var SLANTED = [[8.0, 0, 9.0], [3.0, 8.0, 2.0], [4.0, 0, 0]];//10
var COOL01 = [[0, 5.0, 0], [0, 0, 1.0], [3.0, 0, 7.0]];///coool kernel 1
var COOL02 = [[0, 0, 0], [5.0, 0, 3.0], [ 7.0, 0, 0]];///cool 2 3
var COOL03 = [[4.0, 9.0, 0.0], [6.0, 2.0, 9.0], [0, 3.0, 0]];//11
var COOL04 = [[0, 0, 3.0], [8.0, 0, 4.0], [2.0, 6.0, 1.0]];//12
var COOL05 = [[0.0, 9.0, 6.0], [9.0, 0.0, 6.0], [1.0, 6.0, 0.0]];//13
var COOL06 = [[7.0, 0.0, 7.0], [0.0, 6.0, 3.0], [0.0, 4.0, 6.0]];//14
var CHRIS = [[0.0, 0.0, 1.0], [0.0, 0.0, 4.0], [7.0, 4.0, 2.0]];//15
var STRUCTURE = [[1.0, 0, 0], [7.0, 0, 6.0], [0, 2.0, 0]];///really nice structure
var kernels = [STEINBERG, LINEARRANDOM, FALSESTEINBERG, PARTIALBURKE, INVERTEDSTEINBERG,
                  SLANTED, COOL01, COOL02, COOL03, COOL04, COOL05, COOL06, CHRIS, STRUCTURE];
var di;
var childDither = false;
ker = STEINBERG;
function setup(){
   pixelDensity(1);
   var w = floor(window.innerWidth / 10) * 10;
   var h = floor(window.innerHeight / 10) * 10;
   var cnv = createCanvas(w, h);
   posX = abs((window.innerWidth / 2) - (width / 2));
   posY = 0;
   cnv.position(posX, posY);
   ////creating the array with the kernels
   for(var i = 0; i < kernels.length; i++){
      var ditKer = new ditherKernel(kernelName[i], kernels[i]);
      ditherKernels.push(ditKer);
   }
   //sliders
   slider1 = createSlider(0, 360, random(360), 1);
   slider1.position(posX + 10, posY + 60);
   slider1.style('width', '80px');
   slider2 = createSlider(0, 360, random(360), 1);
   slider2.position(slider1.x, slider1.y + 30);
   slider2.style('width', '80px');
   //sliders for factor and level
   slidFac = createSlider(-3, 20, 16, 0.1);
   slidFac.position(slider1.x, slider2.y + 30);
   slidFac.style('width', '80px');
    //input field 
   input = createInput('choose a fancy name (I will add .png)');
   input.position(slider1.x, posY - 3);
   input.style('width', '200px');
   //save button   
   button = createButton('save');
   button.position(input.x + input.width + 15, input.y + 5);
   button.mousePressed(saveImg);
   button.style('color', '#f00');
                // color: #000;
                // padding: 0px;
                // font-family: Helvetica;
                // font-weight: bolder;
                // font-size: 20px;);
  //change pixel size  button
   pixSize = createSlider(2, 10, 10, 1);
   pixSize.position(slider1.x, slider1.y - 30);
   pixSize.style('width', '80px');  
   genDither = createButton('PIXEL SIZE');
   genDither.position(pixSize.x + pixSize.width + 15, pixSize.y + 5); 
   genDither.mousePressed(updatePix);
   //turn to black and white button
   BW = createButton('BW');
   BW.mousePressed(blackAndWhite);
   BW.position(button.x + button.width + 15, button.y);
   ////image init 
   source = createImage(floor(width / scaleFactor), floor(height / scaleFactor));
   //initialize the gradient image
   colorMode(HSB);
   col1 = color(slider1.value(), 100, 100);
   col2 = color(slider2.value(), 100, 100);
   colorMode(RGB);
   di = new ditherImage(0, 0, w, h, true, source);
   generateDither(STEINBERG);
   console.log(slider1.value(), slider2.value(), prevVal1, prevVal2);
}

function draw(){
  var val1 = slider1.value();
  var val2 = slider2.value();
  if(isBW){
    col1 = color(val1);
    col2 = color(val2);
  }else{
    colorMode(HSB);
    col1 = color(val1, 100, 100);
    col2 = color(val2, 100, 100);
    colorMode(RGB);
  }
  fac = slidFac.value();
  if(prevVal1 != val1 || prevVal2 != val2 || prevFac != fac){
    console.log('true');
    generateDither(ker);
    prevVal1 = val1;
    prevVal2 = val2;
    prevFac = fac;
  }
  //console.log(getFrameRate());
}
//save image function
function saveImg() {
  di.saveImg(input.value(), col1, col2, scaleFactor, fac, lev, ker);
}
function blackAndWhite(){
  isBW = !isBW;
  if(isBW){
    col1 = color(slider1.value());
    col2 = color(slider2.value());
  }else{
    colorMode(HSB);
    col1 = color(slider1.value(), 100, 100);
    col2 = color(slider2.value(), 100, 100);
    colorMode(RGB);
  }
  generateDither(ker);
}
//increase decrease pixel size function
function updatePix(){
  scaleFactor = floor(pixSize.value());
  generateDither(ker);
  //console.log(scaleFactor);
}
function generateDither(kernel){
    console.log(di);
     di.update(col1, col2, fac, lev, ker, scaleFactor);
     di.show();
}