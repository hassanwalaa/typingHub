var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let centerP = document.querySelector(".center p");
let forFree = " For Free!".split("");
let forFreeLen = forFree.length;
// Set the canvas dimensions to match the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an array to hold the dots
var dots = [];

// Generate 1000 random dots
for (var i = 0; i < 1000; i++) {
  // Generate random coordinates
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;

  // Generate random dot size between 0 and 1
  var size = Math.random();

  // Make the color white
  var color = "rgb(255, 255, 255)";

  // Assign a slow velocity to all dots
  var velocity = 0.1;

  // Add the dot to the array
  dots.push({ x: x, y: y, size: size, color: color, velocity: velocity });
}

// Define the update function
function update() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through the dots and draw them
  for (var i = 0; i < dots.length; i++) {
    var dot = dots[i];

    // Move the dot to the left
    dot.x -= dot.velocity;

    // Wrap the dot around to the right when it goes off the left edge of the screen
    if (dot.x < 0) {
      dot.x = canvas.width + dot.x;
    }

    // Draw the dot
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Request the next frame
  requestAnimationFrame(update);
}

// Start the animation loop
update();

function writeP() {
  let counter = 0;
  let writeDown = setInterval(() => {
    let letter = document.createTextNode(`${forFree[counter]}`);
    centerP.appendChild(letter);
    counter++;
    if (counter === forFreeLen) {
      clearInterval(writeDown);
    }
  }, 500);
}

writeP();
