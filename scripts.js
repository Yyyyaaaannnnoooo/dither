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

let side_menu_open = true
const pull = document.querySelector(".pull")
const side_menu = document.querySelector(".side-menu");
const close_arrow = "←";
const open_arrow = "→";
pull.addEventListener("click", () => {
  console.log("click");
  open_close_side_menu();
});
function open_close_side_menu() {
let arrow = pull.querySelector("p");
if (side_menu_open) {
  // side_menu.style.width = "0px";
  // side_menu.style.transform = "translate(-100%, 0%)";
  side_menu.setAttribute("style", "-webkit-transform: translate(-100%, 0%);-moz-transform: translate(-100%, 0%);-ms-transform: translate(-100%, 0%);-o-transform: translate(-100%, 0%);transform: translate(-100%, 0%);");
  // pull.style.left = "0px";
  arrow.innerText = open_arrow;
  side_menu_open = false;
} else {
  // side_menu.style.width = side_menu_w + "px";
  // side_menu.style.transform = "translate(0%, 0%)";
  side_menu.setAttribute("style", "-webkit-transform: translate(0%, 0%);-moz-transform: translate(0%, 0%);-ms-transform: translate(0%, 0%);-o-transform: translate(0%, 0%);transform: translate(0%, 0%);");
  // pull.style.left = pull_pos_x + "px";
  arrow.innerText = close_arrow;
  side_menu_open = true;
}
}