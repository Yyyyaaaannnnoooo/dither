# [Dithering WEB app](https://yano.squatted.online/dither/)

> Dithering algorithms are used to give the illusion of color depth when the color palette of an image needs to be reduced. The error diffusion used in the dithering algorithm *“[adds] the residual quantization error of a pixel onto is neighboring pixels […]”.* A well-dithered image is the one where the algorithm remains unnoticed. The best performances are reached when the algorithm has hidden himself from the viewer. When the algorithm is applied to gradients its camouflage quality gets weaker revealing itself to the viewer’s eyes. Every single pixel of the image is the result of the calculations of the dither, in a way that when you are looking at a dithered gradient you’re looking at the algorithm itself.



# Usage 



* **Button** [SAVE]: save the current dithered image
* **Button** [BW]: change from color to black and white
* **Button** [RADIAL]: change from linear to radial gradient
* **Button** [SHADER]: use a shader as basis for the dither (shader by [Gene Kogan](https://github.com/genekogan/Processing-Shader-Examples))
* **Slider 1**: set the pixel size
* **Slider 2**: set the first color of the gradient
* **Slider 3**: set the second color of the gradient
* **Slider 4**: set the dithering factor
* **Menu**: choose from some dithering presets
* **3 x 3 inputs matrix**: define the values by which the neighbouring pixels need to be caculated when performing the dithering algorithm
