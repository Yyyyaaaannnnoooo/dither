/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    //console.log(document.getElementsByTagName("d")[0].getAttribute("value"));
}
//////
function whichKernel(){
	// //var k = document.getElementsByTagName("d");//.getAttribute("value");
	// var k = document.getElementById("t").getAttribute("value");
	// for(var i = 0; i < k.length; i++){

	// }
	// console.log(k);
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
	console.log(answer);
}
function reveal() {
    document.getElementById("myInfo").classList.toggle("reveal");
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