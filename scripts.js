/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
//////
function whichKernel(){
	var select = document.getElementById("kernel");
	var answer = select.options[select.selectedIndex].value;
	if(ditherKernels != null){
		for(var i = 0; i < ditherKernels.length; i++){
			if(answer == ditherKernels[i].Name){
				ker = ditherKernels[i].Kernel;
				break;
			}
		}
	}
	generateDither(ker);
	//console.log(answer);
}
function reveal() {
    document.getElementById("myInfo").classList.toggle("reveal");
}

function personalDither(){
  var matrix = [];
  var i = 1
  for (var y =  0; y < 3; y++) {
    matrix[y] = [];
    for (var x = 0; x < 3; x++) {
      var matrixVal = document.getElementById("k" + i).value;
      if(isNaN(matrixVal) || matrixVal == '') matrixVal = floor(random(10));
        else matrixVal = parseInt(matrixVal);
        matrix[y][x] = matrixVal;
      //matrix.push(matrixVal);
      i++;
    }
  }
  ker = matrix;
  generateDither(ker);
  //console.log(matrix);
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	 if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if (!event.target.matches('.infobtn')) {
    var info = document.getElementsByClassName("info-content");
    for (i = 0; i < info.length; i++) {
      var openInfo = info[i];

      if (openInfo.classList.contains('reveal')) {
        openInfo.classList.remove('reveal');
      }
    }
  }
}