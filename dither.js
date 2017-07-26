function ditherImage(X, Y, theWidth, theHeight, inverse, sourceImage){
	this.x = X;
	this.y = Y;
	this.w = theWidth;
	this.h = theHeight;
	this.inv = inverse;
	this.sI = sourceImage;

	this.show = function(){
		image(this.ditheredImage, this.x, this.y);
	}

	this.update = function (color1, color2, fac, lev, theKernel, scalingFactor){
		console.log(this.sI);
		this.srcImage = this.gradient(color1, color2, this.sI, ceil(this.w / scalingFactor), ceil(this.h / scalingFactor));
		this.ditheredImage = this.dither(this.srcImage, fac, lev, theKernel, scalingFactor);
		var i = 1;
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				document.getElementById('k' + i).value = theKernel[x][y];
				i++;
			}
		}
	}

	this.saveImg = function(saveTxt, c1, c2, sf, fac, lev, krnl) {
		  saveTxt = this.sortAlphabets(saveTxt);
		  //console.log('saveTxt');
		  var saveImage = createImage(floor(displayWidth / sf), floor(displayHeight / sf));
		  saveImage = this.gradient(c1, c2, saveImage, saveImage.width, saveImage.height);
		  saveImage = this.dither(saveImage, fac, lev, krnl, sf);
		  save(saveImage, saveTxt + '_the_magic_of_sorting.png');
		}
	this.sortAlphabets = function(text) {
		    return text.split('').sort().join('');
		}

	this.dither = function(src1, factor, level, kernel, sc) {
		  ///create a copy of the original image///
		  var src = createImage(src1.width, src1.height);
		  src.loadPixels();
		  src = src1;
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
		                var newR = this.findClosestColor(oldR, level);
		                var newG = this.findClosestColor(oldG, level);
		                var newB = this.findClosestColor(oldB, level);
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
		        }///end of dither


		  src.updatePixels();
		  src = this.nearestN(src, sc);
		  return src;
		}

		this.findClosestColor = function(c, lev) {
		  ///Normalizing the colors///
		  //level = lev;
		  var norm = round(255 / lev);
		  var nC = round((c / 255)) * lev * norm;
		  return nC;
		}
		//enlarging the Pixel
		this.nearestN = function (img, num) {
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

	this.gradient = function (c1, c2, img, w, h) {
	  img = createImage(w, h);
	  img.loadPixels();
	  for (var x = 0; x < img.width; x++) {
	    for (var y = 0; y < img.height; y++) {
	        var d = pixelDensity();
	        for (var i = 0; i < d; i++) {
	           for (var j = 0; j < d; j++) {
	              var index = 4 * ((y * d + j) * img.width * d + (x * d + i));
	              var amp = map(index, 0, img.width * img.height * 4, 0, 1);
	              if(this.inv)var col = lerpColor(c1, c2, amp);
	              	else var col = lerpColor(c2, c1, amp);
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
}