class Dither {
	constructor() {
		this.w = width;
		this.h = height;
		this.PS = 10;//pixel Size
		this.BW = false;
		this.radiant = false;
		this.factor = 16;
		this.col1 = color(100, 20, 47);
		this.col2 = color(55, 150, 20);
		this.kernel = [[0.0, 0.0, 0.0], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBERG
		// this.srcImage = createImage(floor(this.w / this.PS), floor(this.h / this.PS));
		this.initDither();
	}
	initDither() {
		this.ditheredImage = createImage(floor(this.w / this.PS), floor(this.h / this.PS));
	}
	getDither() {
		return this.ditheredImage;
	}
	generateDither() {
		this.ditheredImage = this.dither(this.gradient(), this.factor, this.kernel);
		let i = 1;
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				document.getElementById('k' + i).value = theKernel[x][y];
				i++;
			}
		}
	}
	setPixelSize(val) {
		if (val < 1) this.PS = 1;
		else this.PS = Math.ceil(val);
	}
	setImageSize(_w, _h) {
		this.w = _w;
		this.h = _h;
		this.initDither();
		this.generateDither();
	}
	setColor(c1, c2) {
		if (this.BW) {
			this.col1 = color(c1) || color(255);
			this.col2 = color(c2) || color(0);
		} else {
			colorMode(HSB);
			this.col1 = color(c1, 255, 255) || color(0, 255, 0);
			this.col2 = color(c2, 255, 255) || color(255, 255, 0);
			colorMode(RGB);
		}
	}
	setRadiant(bool) {
		this.radiant = bool;
		this.generateDither();
	}
	setBW(bool) {
		this.BW = bool;
		this.setColor();
		this.generateDither();
	}
	setFactor(val) {
		this.factor = val;
		this.generateDither();
	}
	setKernel(k) {
		this.kernel = k;
		this.generateDither();
	}
	show() {
		image(this.ditheredImage, 0, 0);
	}

	update(color1, color2, fac, theKernel, scalingFactor, isRadial) {
		console.log(this.ditheredImage);
		let img = this.gradient(color1, color2, isRadial);
		this.ditheredImage = this.dither(img, fac, theKernel, this.PS);

	}

	saveImg(saveTxt) {
		// saveTxt = this.sortAlphabets(saveTxt);
		//console.log('saveTxt');
		let saveImage = createImage(floor(displayWidth / this.PS), floor(displayHeight / this.PS));
		saveImage = this.dither(this.gradient(), this.factor, this.kernel);
		save(saveImage, saveTxt + '.png');
	}

	sortAlphabets(text) {
		return text.split('').sort().join('');
	}
	/**
	 * 
	 * @param {ImageBitmap} src1 
	 * @param {Number} factor 
	 * @param {Array} kernel 
	 * @param {Number} sc Scaling factor
	 * @returns The dithered and ienlrged image
	 */
	dither(src1, factor, kernel) {
		///create a copy of the original image///
		let src = createImage(src1.width, src1.height);
		src.loadPixels();
		src = src1;
		//actual dither algorithm
		for (let x = 1; x < src.width - 1; x++) {//x += 1;
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
								if (num != 0) {
									let r = src.pixels[pixIndex];
									let g = src.pixels[pixIndex + 1];
									let b = src.pixels[pixIndex + 2];
									src.pixels[pixIndex] = r + (num / factor) * quantR;
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
		src = this.nearestN(src);
		return src;
	}

	findClosestColor(c) {
		///Normalizing the colors///
		//level = lev;
		let norm = round(255);
		let nC = round((c / 255)) * norm;
		return nC;
	}
	//enlarging the Pixel
	nearestN(img) {
		let destination;
		destination = createImage(img.width * this.PS, img.height * this.PS);
		destination.loadPixels();
		//let a = [][];//a = new float [num][num];
		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < img.width; x++) {
				let d = pixelDensity();
				for (let i = 0; i < d; i++) {
					for (let j = 0; j < d; j++) {
						let index1 = 4 * ((y * d + j) * (img.width * d) + (x * d + i));
						let nX = x * this.PS;
						let nY = y * this.PS;
						//kernel loop//
						for (let yy = 0; yy < this.PS; yy++) {
							for (let xx = 0; xx < this.PS; xx++) {
								let index2 = 4 * ((nX + xx) + destination.width * (nY + yy));//improve with pixel density for retina displays
								destination.pixels[index2] = img.pixels[index1];//red
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

	gradient() {
		let img = createImage(this.w, this.h);
		img.loadPixels();
		let amp = 0
		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				let index = 4 * (y * img.width + x);
				if (this.radiant) {
					let d = dist(x, y, img.width / 2, img.height / 2);
					amp = map(d, 0, img.width / 2, 0, 1);
				} else {
					amp = map(index, 0, img.width * img.height * 4, 0, 1);
				}
				var col = lerpColor(this.col2, this.col1, amp);
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














