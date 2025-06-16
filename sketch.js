function is_mobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

let H = window.innerHeight;
let PIXEL_SIZE = 5;

if (is_mobile()) {
  console.log('is mobile');
  open_close_side_menu()
  side_menu.style.visibility = 'hidden'
  // H = window.innerHeight - 44
  PIXEL_SIZE = 10
}

let ker = [];
let fac = 16;
let lev = 1;
let ditherKernels = [];

let isBW = false;

let uniformsShader;
let pg;

let dither;
const cameras = []
let cam;

initDitherKernels();

// function get_random_position(range) {
//   return range + Math.floor(Math.random() * range);
// }

// function distance(x1, y1, x2, y2) {
//   return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
// }

// function is_overlapping(x, y, positions, min_distance) {
//   for (let i = 0; i < positions.length; i++) {
//       if (distance(x, y, positions[i].x, positions[i].y) < min_distance) {
//           return true;
//       }
//   }
//   return false;
// }

// function generate_non_overlapping_positions(count, range_x, range_y, min_distance) {
//   const positions = [];
//   while (positions.length < count) {
//       const x = get_random_position(range_x);
//       const y = get_random_position(range_y);
//       if (!is_overlapping(x, y, positions, min_distance)) {
//           positions.push({ x, y });
//       }
//   }
//   return positions;
// }

// const count = 5;
// const range_x = 5 * window.innerWidth; // Define the range within which to generate x positions
// const range_y = 5 * window.innerHeight; // Define the range within which to generate y positions
// const min_distance = 100; // Minimum distance between positions

// const positions = generate_non_overlapping_positions(count, range_x, range_y, min_distance);
// console.log(positions);



function preload() {
  // load the shader
  uniformsShader = loadShader('vertex.vert', 'drip.frag');
  pg = createGraphics(floor(window.innerWidth / PIXEL_SIZE), floor(H / PIXEL_SIZE), WEBGL);
}

function setup() {
  pixelDensity(1);
  let w = floor(window.innerWidth / PIXEL_SIZE) * PIXEL_SIZE;
  let h = floor(H / PIXEL_SIZE) * PIXEL_SIZE;
  let cnv = createCanvas(w, h, WEBGL);
  posX = abs((window.innerWidth / 2) - (width / 2));
  posY = 0;
  cnv.position(posX, posY);
  //image init 

  dither = new Dither();
  dither.generateDither();
  cam = createCamera();
  setCamera(cam);
  noStroke()
  if (is_mobile()) {
    BW()
  }
}
//ADD IDLE MODE!
function draw() {
  // orbitControl()
  if (dither.isShader) {
    pg.shader(uniformsShader);
    // shader(uniformsShader);
    let mx = map(mouseX, 0, width, 0, 1);
    let my = map(mouseY, 0, height, 0, 1);
    // image(pg, 0, 0);
    // lets just send frameCount to the shader as a way to control animation over time
    uniformsShader.setUniform('u_time', millis() / 1000);
    // // uniformsShader.setUniform('u_mouse', [mx, my]);
    uniformsShader.setUniform('u_resolution', [pg.width, pg.height]);
    //drip uniforms
    uniformsShader.setUniform('intense', 0.5);
    uniformsShader.setUniform('speed', 1.0);
    uniformsShader.setUniform('graininess', [mx, my]);
    uniformsShader.setUniform('u_mouse1', returnRGBcolor()[0]);
    uniformsShader.setUniform('u_mouse2', returnRGBcolor()[1]);
    // rect gives us some geometry on the screen
    //set the shader on arect in the graphics
    pg.rect(0, 0, pg.width, pg.height);
    dither.generateDither();
  }
  // image(dither.getDither(), -width/2, -height/2);
  texture(dither.getDither())
  push()
  translate(0, 0, 500)
  rotateX(PI)
  box(width * 0.75, height * 0.75, 1000)
  pop()
  push()
  translate(0, 0, 500)
  rotateX(PI + (frameCount * 0.01))
  rotateY((frameCount * 0.027))
  if (is_mobile()) {
    sphere(width * 0.125)
  } else {
    sphere(width * 0.05)
  }
  pop()
  cam.lookAt(cam_vision().x, cam_vision().y, 0)
}

function mouseClicked() {
  if (is_mobile()) {
    dither.setColorMouse(mouseX, mouseY)
  }

}

function cam_vision() {
  const w = width / 2;
  const h = height / 2;
  const x = (mouseX - w) / 2
  const y = (mouseY - h) / 2
  return { x, y }
}

function setShader() {
  dither.isShader = !dither.isShader;
  dither.generateDither();
}
function BW() {
  isBW = !isBW;
  dither.setBW();
}
function windowResized() {
  let w = floor(window.innerWidth / PIXEL_SIZE) * PIXEL_SIZE;
  let h = floor(H / PIXEL_SIZE) * PIXEL_SIZE;
  resizeCanvas(w, h);
  // pg.resize(floor(innerWidth / PIXEL_SIZE), floor(innerHeight / PIXEL_SIZE));
  // pg = createGraphics(floor(innerWidth / PIXEL_SIZE), floor(innerHeight / PIXEL_SIZE), WEBGL);
  dither.setSize(w, h);
}
//save image function
function saveImg() {
  let saveTxt = "I_❤️_DITHERS";
  dither.saveImg(saveTxt);
}

function whichKernel() {
  let select = document.getElementById("kernel");
  let answer = select.options[select.selectedIndex].value;
  let inputKernel;
  if (ditherKernels != null) {
    for (let i = 0; i < ditherKernels.length; i++) {
      if (answer == ditherKernels[i].Name) {
        inputKernel = ditherKernels[i].Kernel;
        break;
      }
    }
  }
  dither.setKernel(inputKernel);
  //console.log(answer);
}


function ditherKernel(name, kernel) {
  this.Name = name;
  this.Kernel = kernel;
}

function initDitherKernels() {
  let kernelName = ['STEINBERG', 'LINEARRANDOM', 'FALSESTEINBERG', 'PARTIALBURKE', 'INVERTEDSTEINBERG',
    'SLANTED', 'COOL01', 'COOL02', 'COOL03', 'COOL04', 'COOL05', 'COOL06', 'CHRIS', 'STRUCTURE'];
  let STEINBERG = [[0.0, 0.0, 0.0], [0.0, 0.0, 7.0], [3.0, 5.0, 1.0]]; //STEINBErg
  let LINEARRANDOM = [[0, 3.0, 0], [5.0, 0, 1.0], [0, 7.0, 0]];///linear 2
  let FALSESTEINBERG = [[0, 0, 0], [0, 0, 3.0], [0, 3.0, 2.0]];///false seinberg factor 8 4
  let PARTIALBURKE = [[0, 0, 0], [0, 0, 8.0], [4.0, 8.0, 4.0]];//part of burke factor 32 // really nice at low  factor 3.9 and level 2
  let INVERTEDSTEINBERG = [[1.0, 5.0, 3.0], [7.0, 0, 0], [0, 0, 0]];//8
  let SLANTED = [[8.0, 0, 9.0], [3.0, 8.0, 2.0], [4.0, 0, 0]];//10
  let COOL01 = [[0, 5.0, 0], [0, 0, 1.0], [3.0, 0, 7.0]];///coool kernel 1
  let COOL02 = [[0, 0, 0], [5.0, 0, 3.0], [7.0, 0, 0]];///cool 2 3
  let COOL03 = [[4.0, 9.0, 0.0], [6.0, 2.0, 9.0], [0, 3.0, 0]];//11
  let COOL04 = [[0, 0, 3.0], [8.0, 0, 4.0], [2.0, 6.0, 1.0]];//12
  let COOL05 = [[0.0, 9.0, 6.0], [9.0, 0.0, 6.0], [1.0, 6.0, 0.0]];//13
  let COOL06 = [[7.0, 0.0, 7.0], [0.0, 6.0, 3.0], [0.0, 4.0, 6.0]];//14
  let CHRIS = [[0.0, 0.0, 1.0], [0.0, 0.0, 4.0], [7.0, 4.0, 2.0]];//15
  let STRUCTURE = [[1.0, 0, 0], [7.0, 0, 6.0], [0, 2.0, 0]];///really nice structure
  let kernels = [STEINBERG, LINEARRANDOM, FALSESTEINBERG, PARTIALBURKE, INVERTEDSTEINBERG,
    SLANTED, COOL01, COOL02, COOL03, COOL04, COOL05, COOL06, CHRIS, STRUCTURE];
  //creating the array with the kernels
  for (let i = 0; i < kernels.length; i++) {
    let ditKer = new ditherKernel(kernelName[i], kernels[i]);
    ditherKernels.push(ditKer);
  }
  ker = STEINBERG;
}
/**
 * @returns an array of colors to be used as vec3 uniform in the shader
 */
function returnRGBcolor() {
  let color1 = [];
  let color2 = [];
  let x = document.getElementById('color1').value;
  let y = document.getElementById('color2').value;
  if (!isBW) {
    // if is color mode
    colorMode(HSB);

    let col1 = color(x, 255, 255);
    let col2 = color(y, 255, 255);

    color1[0] = map(red(col1), 0, 255, 0, 1);
    color1[1] = map(green(col1), 0, 255, 0, 1);
    color1[2] = map(blue(col1), 0, 255, 0, 1);

    color2[0] = map(red(col2), 0, 255, 0, 1);
    color2[1] = map(green(col2), 0, 255, 0, 1);
    color2[2] = map(blue(col2), 0, 255, 0, 1);

    colorMode(RGB);
  } else {
    // else is it is in BW
    color1[0] = map(red(x), 0, 255, 0, 1);
    color1[1] = map(green(x), 0, 255, 0, 1);
    color1[2] = map(blue(x), 0, 255, 0, 1);

    color2[0] = map(red(y), 0, 255, 0, 1);
    color2[1] = map(green(y), 0, 255, 0, 1);
    color2[2] = map(blue(y), 0, 255, 0, 1);

  }
  return [color1, color2];
}
