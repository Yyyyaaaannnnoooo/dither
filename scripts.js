/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
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