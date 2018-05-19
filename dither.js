class Dither {
	constructor() {
		this.w = width;
		this.h = height;
		this.PS = 10;//pixel Size
		this.BW = false;
		this.radiant = false;
		this.factor = 16;
		this.col1 = color(random(255), random(255), random(255));
		this.col2 = color(random(255), random(255), random(255));
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
		// here we set the value of the kernel in the main page that updates
		let i = 1;
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				document.getElementById('k' + i).value = this.kernel[x][y];
				i++;
			}
		}
	}
	setPixelSize() {
		this.PS = parseInt(document.getElementById("pixSize").value);
		this.generateDither();
		console.log('pix')
	}
	setSize(_w, _h) {
		this.w = _w;
		this.h = _h;
		this.initDither();
		this.generateDither();
	}
	setColor() {
		let c1 = floor(document.getElementById("color1").value);
		let c2 = floor(document.getElementById("color2").value);
		if (this.BW) {
			this.col1 = color(c1) || color(255);
			this.col2 = color(c2) || color(0);
		} else {
			colorMode(HSB);
			this.col1 = color(c1, 255, 255) || color(0, 255, 0);
			this.col2 = color(c2, 255, 255) || color(255, 255, 0);
			colorMode(RGB);
		}
		this.generateDither();
	}
	setRadiant() {
		this.radiant = !this.radiant;
		this.generateDither();
	}
	setBW() {
		this.BW = !this.BW;
		this.setColor();
		this.generateDither();
	}
	setFactor() {
		this.factor = parseFloat(document.getElementById('factor').value);
		this.generateDither();
	}
	setKernel(k) {
		this.kernel = k || kernelFromInput();
		this.generateDither();

		function kernelFromInput() {
			let matrix = [];
			let i = 1
			for (let y = 0; y < 3; y++) {
				matrix[y] = [];
				for (let x = 0; x < 3; x++) {
					let matrixVal = document.getElementById("k" + i).value;
					if (isNaN(matrixVal) || matrixVal == '') matrixVal = floor(random(100));
					else matrixVal = parseInt(matrixVal);
					matrix[y][x] = matrixVal;
					//matrix.push(matrixVal);
					i++;
				}
			}
			return matrix;
		}
	}

	saveImg(saveTxt) {
		// saveTxt = this.sortAlphabets(saveTxt);
		//console.log('saveTxt');
		let saveImage = createImage(floor(displayWidth / this.PS), floor(displayHeight / this.PS));
		saveImage = this.dither(this.gradient(), this.factor, this.kernel);
		saveImage.save(saveTxt, 'jpg');
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
		// console.log(destination);
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
		let img = createImage(floor(this.w / this.PS), floor(this.h / this.PS));
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














