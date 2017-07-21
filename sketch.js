var source, big, gradient;
var scaleFactor = 10;
var kernCount = 0, posX, posY, prevVal1, prevVal2, prevFac, prevLev;
var input, button, saveTxt, changeKernel, genDither, slider1, slider2, pixSize, slidFac, slidLev;
var ker = [];
var fac = 16, lev = 1;
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
console.log(kernels);
ker = STEINBERG;
function setup(){
   pixelDensity(1);
   var w = floor(window.innerWidth / 10) * 10;
   var h = floor(window.innerHeight / 10) * 10;
   console.log(w, h);
   var cnv = createCanvas(w, h);
   posX = abs((window.innerWidth / 2) - (width / 2));
   posY = 0;
   cnv.position(posX, posY);
   //sliders
   slider1 = createSlider(0, 360, 60, 1);
   slider1.position(posX + 10, posY + 50);
   slider1.style('width', '80px');
   slider2 = createSlider(0, 360, 240, 1);
   slider2.position(slider1.x, slider1.y + 30);
   slider2.style('width', '80px');
   //sliders for factor and level
   slidFac = createSlider(-3, 20, 16, 0.5);
   slidFac.position(slider1.x, slider2.y + 30);
   slidFac.style('width', '80px');
    //input field 
   input = createInput('choose a fancy name (I will add .png)');
   input.position(slider1.x, posY);
   input.style('width', '200px');
   //save button   
   button = createButton('save');
   button.position(input.x + input.width + 5, input.y);
   button.mousePressed(saveImg);
   button.style('color', '#f00');
                // color: #000;
                // padding: 0px;
                // font-family: Helvetica;
                // font-weight: bolder;
                // font-size: 20px;);
   //info button
   var info = createButton('AS SMALLER AS THE PIXELS ARE AS SLOWER THE SCRIPT RUNS');
   info.position(button.x + button.width, posY);
  //change pixel size  button
   pixSize = createSlider(2, 10, 10, 1);
   pixSize.position(slider1.x, slider1.y - 30);
   pixSize.style('width', '80px');  
   genDither = createButton('PIXEL SIZE');
   genDither.position(pixSize.x + pixSize.width + 5, pixSize.y); 
   genDither.mousePressed(updatePix);
   ////image init 
   source = createImage(floor(width / scaleFactor), floor(height / scaleFactor));
   //initialize the gradient image
   var val1 = slider1.value();
   var val2 = slider2.value();
   colorMode(HSB);
   col1 = color(val1, 100, 100);
   col2 = color(val2, 100, 100);
   colorMode(RGB);
   generateDither(STEINBERG);
}

function draw(){
  var val1 = slider1.value();
  var val2 = slider2.value();
  colorMode(HSB);
  col1 = color(val1, 100, 100);
  col2 = color(val2, 100, 100);
  colorMode(RGB);
  fac = slidFac.value();
  if(prevVal1 != val1 || prevVal2 != val2 || prevFac != fac){
    generateDither(ker);
    prevVal1 = val1;
    prevVal2 = val2;
    prevFac = fac;
  }
}
//save image function
function saveImg() {
  saveTxt = input.value();
  saveTxt = sortAlphabets(saveTxt);
  console.log('saveTxt')
  save(big, saveTxt + '_the_magic_of_sorting.png');
}
var sortAlphabets = function(text) {
    return text.split('').sort().join('');
};
function randomKernel(){
  generateDither(kernels[floor(random(14))]);
}
//increase decrease pixel size function
function updatePix(){
  scaleFactor = floor(pixSize.value());
  generateDither(ker);
  console.log(scaleFactor);
}
function generateDither(kernel){
  source = randomGradient(col1, col2, source, floor(width / scaleFactor), floor(height / scaleFactor));  
  //var ker = kernels[kernCount % 14];
  var display = dither(source, fac, lev, kernel);
  big = nearestN(display, scaleFactor);
  image(big, 0, 0);
  console.log('dither');
}


function randomGradient(c1, c2, img, w, h) {
  img = createImage(w, h);
  img.loadPixels();
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
        var d = pixelDensity();
        for (var i = 0; i < d; i++) {
           for (var j = 0; j < d; j++) {
              var index = 4 * ((y * d + j) * img.width * d + (x * d + i));
              var amp = map(index, 0, img.width * img.height * 4, 0, 1);
              var col = lerpColor(c1, c2, amp);
              img.pixels[index] = red(col);
              img.pixels[index + 1] = green(col);
              img.pixels[index + 2] = blue(col);
              img.pixels[index + 3] = 255;
           }
        }
      }
  }
  img.updatePixels();
  return img;
}


function dither(src1, factor, level, kernel) {
  ///create a copy of the original image///
  var src = createImage(src1.width, src1.height);
  src.loadPixels();
    for (var y = 0; y < src.height; y++) {
      for (var x = 0; x < src.width; x++) {
        var d = pixelDensity();
        for (var i = 0; i < d; i++) {
           for (var j = 0; j < d; j++) {
              var index = 4 * ((y * d + j) * src.width * d + (x * d + i));
              src.pixels[index] = src1.pixels[index];
              src.pixels[index + 1] = src1.pixels[index + 1];
              src.pixels[index + 2] = src1.pixels[index + 2];
              src.pixels[index + 3] = 255;
           }
        }
      }
  }

//actual dither algorithm
  for (var x = 1; x < src.width - 1; x++) {
    for (var y = 1; y < src.height - 1; y++) {
            var d = pixelDensity();
            for (var i = 0; i < d; i++) {
              for (var j = 0; j < d; j++) {
                var index = 4 * ((y * d + j) * src.width * d + (x * d + i));
                //save old pixel in a variable
                var oldR = src.pixels[index];
                var oldG = src.pixels[index + 1];
                var oldB = src.pixels[index + 2];
                var alfa = 255
                //find closest color
                var newR = findClosestColor(oldR, level);
                var newG = findClosestColor(oldG, level);
                var newB = findClosestColor(oldB, level);
                //replace old pix with new pixel
                src.pixels[index] = newR;
                src.pixels[index + 1] = newG;
                src.pixels[index + 2] = newB;
                //calculating the quantization error
                var quantR = oldR - newR;
                var quantG = oldG - newG;
                var quantB = oldB - newB;
                //calculating the dither upon the pixels
                for (var ky = -1; ky <= 1; ky++) {
                  for (var kx = -1; kx <= 1; kx++) {
                    var num = kernel[kx + 1][ky + 1];
                    var pixIndex = 4 * ((x + kx) + ((y + ky) * src.width));
                    if(num != 0){
                      var r = src.pixels[pixIndex];
                      var g = src.pixels[pixIndex + 1];
                      var b = src.pixels[pixIndex + 2];
                      src.pixels[pixIndex]     = r + (num / factor) * quantR;
                      src.pixels[pixIndex + 1] = g + (num / factor) * quantG;
                      src.pixels[pixIndex + 2] = b + (num / factor) * quantB;
                    }
                  }
                }
              }
            }
          }
        }
  src.updatePixels();
  return src;
}

function findClosestColor(c, lev) {
  ///Normalizing the colors///
  //level = lev;
  var norm = round(255 / lev);
  var nC = round((c / 255)) * lev * norm;
  return nC;
}

function nearestN(img, num) {
  var destination;
  destination = createImage(img.width * num, img.height * num);
  destination.loadPixels();
  //var a = [][];//a = new float [num][num];
  for ( var y = 0; y < img.height; y++) {
    for ( var x = 0; x < img.width; x++) {
      var d = pixelDensity();
            for (var i = 0; i < d; i++) {
              for (var j = 0; j < d; j++) {
                var i = 4 * ((y * d + j) * (img.width * d) + (x * d + i));
                var nX = x * num;
                var nY = y * num;
                //kernel loop//
                for ( var yy = 0; yy < num; yy++) {
                  for ( var xx = 0; xx < num; xx++) {
                    var index = 4 * ((nX + xx) + destination.width * (nY + yy));//improve with pixel density for retina displays
                    destination.pixels[index]    = img.pixels[i];//red
                    destination.pixels[index + 1] = img.pixels[i + 1];//grenn
                    destination.pixels[index + 2] = img.pixels[i + 2];//blue
                    destination.pixels[index + 3] = 255; //alpha channel
                  }
                }
              }
            }      
    }
  }
  destination.updatePixels();
  return destination;
}
