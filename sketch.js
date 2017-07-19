var source, big;
var scaleFactor = 10;
var kernCount = 0;
var input, button, saveTxt, changeKernel;
var kernels = [];
var STEINBERG = [[0.0, 0.0, 0.0 ], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
var LINEARRANDOM = [[0, 3.0, 0], [ 5.0, 0, 1.0], [0, 7.0, 0]];///linear 2
var FALSESTEINBERG = [[0, 0, 0], [0, 0, 3.0], [0, 3.0, 2.0]];///false seinberg factor 8 4
var PARTIALBURKE = [[0, 0, 0], [0, 0, 8.0], [4.0, 8.0, 4.0]];//part of burke factor 32 // really nice at low  factor 3.9 and level 2
var INVERTEDSTEINBERG = [[1.0, 5.0, 3.0], [7.0, 0, 0], [0, 0, 0]];//8
//8.433198 | 3.2546508 | 3.9625964 | 0.0 | 7.693716 | 0.0 | 8.920265 | 1.7277707 | 0.0 |
var SLANTED = [[8.0, 0, 9.0], [3.0, 8.0, 2.0], [4.0, 0, 0]];//10
var COOL01 = [[0, 5.0, 0], [0, 0, 1.0], [3.0, 0, 7.0]];///coool kernel 1
var COOL02 = [[0, 0, 0], [5.0, 0, 3.0], [ 7.0, 0, 0]];///cool 2 3
//4.0718956 | 8.834968 | 0.0 | 6.1390076 | 1.7300752 | 8.536661 | 0.0 | 2.5298612 | 0.0 | Very Cool
var COOL03 = [[4.0, 9.0, 0.0], [6.0, 2.0, 9.0], [0, 3.0, 0]];//11
//0.0 | 0.0 | 3.1726065 | 7.5329027 | 0.0 | 4.401523 | 1.5556533 | 5.9921546 | 1.4675739 | nice
var COOL04 = [[0, 0, 3.0], [8.0, 0, 4.0], [2.0, 6.0, 1.0]];//12
//0.0 | 8.747081 | 6.04726 | 8.657113 | 0.0 | 5.8474283 | 1.3418581 | 5.7040114 | 0.0 | nice 3
var COOL05 = [[0.0, 9.0, 6.0], [9.0, 0.0, 6.0], [1.0, 6.0, 0.0]];//13
//6.564631 | 0.0 | 6.814121 | 0.0 | 6.3458323 | 3.4435391 | 0.0 | 4.157616 | 5.9172835 | vertical horizontal lines
var COOL06 = [[7.0, 0.0, 7.0], [0.0, 6.0, 3.0], [0.0, 4.0, 6.0]];//14
//0.0 | 0.0 | 0.6782781 | 0.0 | 0.0 | 3.9686522 | 6.8295755 | 3.8442783 | 2.198808 |//ADD IT!
var CHRIS = [[0.0, 0.0, 1.0], [0.0, 0.0, 4.0], [7.0, 4.0, 2.0]];//15
var STRUCTURE = [[1.0, 0, 0], [7.0, 0, 6.0], [0, 2.0, 0]];///really nice structure
kernels.push(STEINBERG);
kernels.push(LINEARRANDOM);
kernels.push(FALSESTEINBERG);
kernels.push(PARTIALBURKE);
kernels.push(INVERTEDSTEINBERG);
kernels.push(SLANTED);
kernels.push(COOL01);
kernels.push(COOL02);
kernels.push(COOL03);
kernels.push(COOL04);
kernels.push(COOL05);
kernels.push(COOL06);
kernels.push(CHRIS);
kernels.push(STRUCTURE);
console.log(kernels);
function setup(){
   //pixelDensity(1);
   createCanvas(displayWidth, displayHeight);
   //sliders
   slider1 = createSlider(0, 360, 60, 1);
   slider1.position(10, 50);
   slider1.style('width', '80px');
   slider2 = createSlider(0, 360, 24, 1);
   slider2.position(slider1.x, slider1.y + 40);
   slider2.style('width', '80px');
   //input button for saving image
   input = createInput('name the dither (I will add .png)');
   input.position(slider1.x, 5);
   input.style('width', '180px')
   button = createButton('save');
   button.position(input.x + input.width + 5, 5);
   button.mousePressed(saveImg);
   //change kernel button
   changeKernel = createButton('change dither');
   changeKernel.position(input.x, 25);
   changeKernel.mousePressed(nextKernel);
   // saveTxt = createElement('h3', 'name the dither (I will add .png)');
   // saveTxt.position(input.x + input.width + button.width, 0);
   ////image init 
   source = createImage(width / scaleFactor, height / scaleFactor);
   source = randomGradient(color(255, 0, 0), color(0, 255, 0), source, scaleFactor);
   var ker = kernels[kernCount % 14];
   var display = dither(source, 16, 1, ker);
   // image(display, 0, 400);
   // image(source,0,0);
   big = nearestN(display, scaleFactor);
   image(big, 0, 0);
}

function draw(){
  var val1 = slider1.value();
  var val2 = slider2.value();
  colorMode(HSB);
  col1 = color(val1, 100, 100);
  col2 = color(val2, 100, 100);
  colorMode(RGB);
  stroke(255, 255, 0);
  strokeWeight(4);
  fill(col1);
  rect(slider1.x - 5, slider1.y - (slider1.height / 2), 80, 20);
  fill(col2);
  rect(slider1.x - 5, slider2.y - (slider2.height / 2), 80, 20);  
  // fill(255);
  // rect(saveTxt.x - 10, saveTxt.y + 10, saveTxt.width, saveTxt.height);
}
function mouseDragged(){
  // var val1 = slider1.value();
  // var val2 = slider2.value();
  // colorMode(HSB);
  // col1 = color(val1, 100, 100);
  // col2 = color(val2, 100, 100);
  // colorMode(RGB);
  source = randomGradient(col1, col2, source, scaleFactor);  
  var ker = kernels[kernCount % 14];
  var display = dither(source, 16, 1, ker);
  // image(display, 0, 400);
  // image(source,0,0);
  big = nearestN(display, scaleFactor);
  image(big, 0, 0);
}
//
//save image function
function saveImg() {
  save(big, input.value() + '.png');
}
function nextKernel(){
  kernCount ++;
  source = randomGradient(col1, col2, source, scaleFactor);  
  var ker = kernels[kernCount % 14];
  var display = dither(source, 16, 1, ker);
  // image(display, 0, 400);
  // image(source,0,0);
  big = nearestN(display, scaleFactor);
  image(big, 0, 0);
}
function randomGradient(c1, c2, img, sclFac) {
  img = createImage(width / sclFac, height / sclFac);
  //var img = createImage(100, 100);
  // var c1 = color(0, 255, 255, 255); // set them back
  // var c2 = color(255, 0, 255, 255);
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
  var s = 1;
  ///create a copy of the original image///
  var src = createImage(src1.width, src1.height);
  //src.pixels = arrayCopy(src1.pixels, src.pixels);
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
