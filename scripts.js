/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}


function steinberg(){
	ker = kernels[0]
  generateDither(ker);
}
function linear(){
  	ker = kernels[1]
  generateDither(ker);
}
function falsest(){
  	ker = kernels[2];
  generateDither(ker);
}
function part(){
  	ker = kernels[3];
  generateDither(ker);
}
function inverted(){
  	ker = kernels[4];
  generateDither(ker);
}
function slanted(){
  	ker = kernels[5];
  generateDither(ker);
}
function cool01(){
  	ker = kernels[6];
  generateDither(ker);
}
function cool02(){
  	ker = kernels[7];
  generateDither(ker);
}
function cool03(){
  	ker = kernels[8];
  generateDither(ker);
}
function cool04(){
  	ker = kernels[9];
  generateDither(ker);
}
function cool05(){
  	ker = kernels[10];
  generateDither(ker);
}
function cool06(){
  	ker = kernels[11];
  generateDither(ker);
}
function chris(){
  	ker = kernels[12];
  generateDither(ker);
}
function structure(){
  	ker = kernels[13];
  generateDither(ker);
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}