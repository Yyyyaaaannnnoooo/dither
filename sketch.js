var im;
var kernel = [[0.0, 0.0, 0.0 ], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
function setup(){
   //pixelDensity(1);
   createCanvas(800,800);
   slider1 = createSlider(0, 360, 60, 1);
   slider1.position(700, 10);
   slider1.style('width', '150px');
   slider2 = createSlider(0, 360, 240, 1);
   slider2.position(700, 490);
   slider2.style('width', '150px');
   im = randomGradient(color(255, 0, 0), color(0, 255, 0));
   var display = dither(im, 16, 1);
   image(display, 0, 400);
   image(im,0,0);
   var big = nearestN(display, 5);
   image(big, 100, 0);
}

function draw(){
  var val1 = slider1.value();
  var val2 = slider2.value();
  colorMode(HSB);
  col1 = color(val1, 100, 100);
  col2 = color(val2, 100, 100);
  colorMode(RGB);
  noStroke();
  fill(col1);
  rect(700, 10, 150, 20)
  fill(col2);
  rect(700, 490, 150, 20)
}
function mouseDragged(){
  var val1 = slider1.value();
  var val2 = slider2.value();
  colorMode(HSB);
  col1 = color(val1, 100, 100);
  col2 = color(val2, 100, 100);
  colorMode(RGB);
  im = randomGradient(col1, col2);
  var display = dither(im, 16, 1);
  image(display, 0, 400);
  image(im,0,0);
  var big = nearestN(display, 5);
  image(big, 100, 0);
}

function randomGradient(c1, c2) {
  var img = createImage(100, 100);
  // var c1 = color(0, 255, 255, 255); // set them back
  // var c2 = color(255, 0, 255, 255);
  img.loadPixels();
    for (var y = 0; y < img.width; y++) {
    for (var x = 0; x < img.height; x++) {
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


function dither(src1, factor, level) {
  var s = 1;
  ///create a copy of the original image///
  var src = createImage(src1.width, src1.height);
  //src.pixels = arrayCopy(src1.pixels, src.pixels);
  src.loadPixels();
    for (var y = 0; y < src.width; y++) {
    for (var x = 0; x < src.height; x++) {
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
