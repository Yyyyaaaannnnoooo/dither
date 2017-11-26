function ditherImage(X, Y, theWidth, theHeight, inverse, sourceImage){
	this.x = X;
	this.y = Y;
	this.w = theWidth;
	this.h = theHeight;
	this.inv = inverse;
	this.sI = sourceImage;
	let col = 255;
	let colorPalette = [
	new p5.Vector(col, 0, 0), 
	new p5.Vector(0, col, 0), 
	new p5.Vector(0, 0, col),
	new p5.Vector(col, col, 0), 
	new p5.Vector(0, col, col), 
	new p5.Vector(col, 0, col),
	new p5.Vector(0, 0, 0), 
	new p5.Vector(col, col, col), 
	]
	this.show = function(){
		image(this.ditheredImage, this.x, this.y);
	}

	this.update = function (color1, color2, fac, lev, theKernel, scalingFactor, isRadial){
		//console.log(this.sI);
		this.srcImage = this.gradient(color1, color2, this.sI, ceil(this.w / scalingFactor), ceil(this.h / scalingFactor), isRadial);
		this.ditheredImage = this.dither(this.srcImage, fac, lev, theKernel, scalingFactor);
		let i = 1;
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				document.getElementById('k' + i).value = theKernel[x][y];
				i++;
			}
		}
	}

	this.saveImg = function(saveTxt, c1, c2, sf, fac, lev, krnl, isRadial) {
		  // saveTxt = this.sortAlphabets(saveTxt);
		  //console.log('saveTxt');
		  let saveImage = createImage(floor(displayWidth / sf), floor(displayHeight / sf));
		  saveImage = this.gradient(c1, c2, saveImage, saveImage.width, saveImage.height, isRadial);
		  saveImage = this.dither(saveImage, fac, lev, krnl, sf);
		  save(saveImage, saveTxt + '.png');
		}
		this.sortAlphabets = function(text) {
			return text.split('').sort().join('');
		}

		this.dither = function(src1, factor, level, kernel, sc) {
		  ///create a copy of the original image///
		  let src = createImage(src1.width, src1.height);
		  src.loadPixels();
		  src = src1;
		//actual dither algorithm
		for (let x = 1; x < src.width - 1; x++) {
			for (let y = 1; y < src.height - 1; y++) {
				let d = pixelDensity();
				for (let i = 0; i < d; i++) {
					for (let j = 0; j < d; j++) {
						let index = 4 * ((y * d + j) * src.width * d + (x * d + i));
		                //save old pixel in a variable
		                let oldR = src.pixels[index];
		                let oldG = src.pixels[index + 1];
		                let oldB = src.pixels[index + 2];
		                let alfa = 255
		                //find closest color
		                let newR = this.findClosestColor(oldR);
		                let newG = this.findClosestColor(oldG);
		                let newB = this.findClosestColor(oldB);
		                //replace old pix with new pixel
		                src.pixels[index] = newR;
		                src.pixels[index + 1] = newG;
		                src.pixels[index + 2] = newB;
		                //calculating the quantization error
		                let quantR = oldR - newR;
		                let quantG = oldG - newG;
		                let quantB = oldB - newB;
		                //calculating the dither upon the pixels
		                for (let ky = -1; ky <= 1; ky++) {
		                	for (let kx = -1; kx <= 1; kx++) {
		                		let num = kernel[kx + 1][ky + 1];
		                		let pixIndex = 4 * ((x + kx) + ((y + ky) * src.width));
		                		if(num != 0){
		                			let r = src.pixels[pixIndex];
		                			let g = src.pixels[pixIndex + 1];
		                			let b = src.pixels[pixIndex + 2];
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

		    this.findClosestColor = function(c) {
		  ///Normalizing the colors///
		  //level = lev;
		  let norm = round(255);
		  let nC = round((c / 255)) * norm;
		  return nC;
		}
		//enlarging the Pixel
		this.nearestN = function (img, num) {
			let destination;
			destination = createImage(img.width * num, img.height * num);
			destination.loadPixels();
		  //let a = [][];//a = new float [num][num];
		  for ( let y = 0; y < img.height; y++) {
		  	for ( let x = 0; x < img.width; x++) {
		  		let d = pixelDensity();
		  		for (let i = 0; i < d; i++) {
		  			for (let j = 0; j < d; j++) {
		  				let index1 = 4 * ((y * d + j) * (img.width * d) + (x * d + i));
		  				let nX = x * num;
		  				let nY = y * num;
		                //kernel loop//
		                for ( let yy = 0; yy < num; yy++) {
		                	for ( let xx = 0; xx < num; xx++) {
		                    let index2 = 4 * ((nX + xx) + destination.width * (nY + yy));//improve with pixel density for retina displays
		                    destination.pixels[index2]    = img.pixels[index1];//red
		                    destination.pixels[index2 + 1] = img.pixels[index1 + 1];//grenn
		                    destination.pixels[index2 + 2] = img.pixels[index1 + 2];//blue
		                    destination.pixels[index2 + 3] = 255; //alpha channel
		                }
		            }
		        }
		    }      
		}
	}
	destination.updatePixels();
	return destination;
}

this.gradient = function (c1, c2, img, w, h, radial) {
	img = createImage(w, h);
	img.loadPixels();
	let amp = 0
	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {        
			let index = 4 * (y * img.width + x);
			if(radial){
				let d = dist(x, y, img.width / 2, img.height / 2);
				amp = map(d, 0, img.width / 2, 0, 1);
			} else {
				amp = map(index, 0, img.width * img.height * 4, 0, 1);
			}
			var col = lerpColor(c2, c1, amp);
			img.pixels[index] = red(col);
			img.pixels[index + 1] = green(col);
			img.pixels[index + 2] = blue(col);
			img.pixels[index + 3] = 255;
		}
	}
	img.updatePixels();
	return img;
}
}














