var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width, height;

var resize = function () {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
};
window.onresize = resize;
resize();

ctx.fillStyle = "red";

var state = {
  position: {
    x: width / 2,
    y: height / 2
  },
  movement: {
    x: 0,
    y: 0
  },
  rotation: 0,
  pressedKeys: {
    left: false,
    right: false,
    up: false,
    down: false
  }
};

var keyMap = {
  39: "right",
  37: "left",
  38: "up",
  40: "down"
};

function keydown(e) {
  state.pressedKeys[keyMap[e.keyCode]] = true;
}

function keyup(e) {
  state.pressedKeys[keyMap[e.keyCode]] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

function update(delta) {
  delta /= 16;
  updateRotation(delta);
  updateMovement(delta);
  updatePostition(delta);
}

function updateRotation(delta) {
  if (state.pressedKeys.left) {
    state.rotation -= delta * 3;
  } else if (state.pressedKeys.right) {
    state.rotation += delta * 3;
  }
}

function updateMovement(delta) {
  const gravity = 0.05;
  const maxSpeed = 5;
  var accelerationVector = {
    x: delta * 0.2 * Math.cos((state.rotation - 90) * (Math.PI / 180)),
    y: delta * 0.2 * Math.sin((state.rotation - 90) * (Math.PI / 180))
  };
  if (state.pressedKeys.up) {
    state.movement.x += accelerationVector.x;
    state.movement.y += accelerationVector.y;
  } else if (state.pressedKeys.down) {
    state.movement.x -= accelerationVector.x;
    state.movement.y -= accelerationVector.y;
  }
  if (state.movement.x > maxSpeed) {
    state.movement.x = maxSpeed;
  } else if (state.movement.x < -maxSpeed) {
    state.movement.x = -maxSpeed;
  }
  if (state.movement.y > maxSpeed) {
    state.movement.y = maxSpeed;
  } else if (state.movement.y < -maxSpeed) {
    state.movement.y = -maxSpeed;
  }
  if (state.position.y !== height - 110) {
    state.movement.y += gravity;
  } else {
    state.movement.x = 0;
  }
}

function updatePostition(delta) {
  state.position.x += state.movement.x;
  state.position.y += state.movement.y;

  if (state.position.x > width) {
    state.position.x -= width;
  } else if (state.position.x < 0) {
    state.position.x += width;
  }
  if (state.position.y > height - 110) {
    state.position.y = height - 110;
  } else if (state.position.y < 0) {
    state.position.y += height - 110;
  }
}

function render() {
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(state.position.x, state.position.y);
  ctx.rotate((Math.PI / 180) * state.rotation);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.lineTo(0, -20);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height - 100);
  ctx.lineTo(width, height - 100);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function loop(timestamp) {
  var delta = timestamp - lastTimestamp;
  update(delta);
  render();
  lastTimestamp = timestamp;
  window.requestAnimationFrame(loop);
}
var lastTimestamp = 0;
window.requestAnimationFrame(loop);
