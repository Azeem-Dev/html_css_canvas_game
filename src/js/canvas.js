import platform from "./imgs/platform.png";
import hills from "./imgs/hills.png";
import background from "./imgs/background.png";
import platformSmallTall from "./imgs/platformSmallTall.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
    this.speed=20;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    // else this.velocity.y = 0;
  }
}

class Platform {
  constructor(x, y, image) {
    this.position = {
      x,
      y,
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor(x, y, image) {
    this.position = {
      x,
      y,
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const createImage = (imageSrc) => {
  const image = new Image();
  image.src = imageSrc;
  return image;
};

let player = new Player();

let platformImage = createImage(platform);
let platformSmallTallImage =createImage(platformSmallTall)

let platforms = [
];

let genericObjects = [
];


const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;


const init = () => {
  player = new Player();

  platforms = [
    new Platform(platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, 270, platformSmallTallImage),
    new Platform(-1, 470, platformImage),
    new Platform(platformImage.width - 3, 470, platformImage),
    new Platform(platformImage.width * 2 + 100, 470, platformImage),
    new Platform(platformImage.width * 3 + 300, 470, platformImage),
    new Platform(platformImage.width * 4 + 300-2, 470, platformImage),
    new Platform(platformImage.width * 5 + 700-2, 470, platformImage),
  ];

  genericObjects = [
    new GenericObject(-1, -1, createImage(background)),
    new GenericObject(-1, -1, createImage(hills)),
  ];
  scrollOffset = 0;
};
const animate = () => {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  //   platform.draw();

  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((object) => {
        object.position.x -= player.speed * .66;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((object) => {
        object.position.x += player.speed * .66;
      });
    }
  }

  // Platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (scrollOffset > platformImage.width * 5 + 900-2) {
    console.log("You win");
  }

  // Lose condition
  if (player.position.y > canvas.height) {
    init();
  }
};


init();
animate();


addEventListener("keydown", ({ keyCode }) => {
  //65 -> a/left , 83 -> s/down, 68 -> d/right, 87 -> w/up
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break;
    case 83:
      break;
    case 68:
      //   player.velocity.x = 1;
      keys.right.pressed = true;
      break;
    case 87:
      player.velocity.y -= 10;
      break;
  }
});
addEventListener("keyup", ({ keyCode }) => {
  //65 -> a/left , 83 -> s/down, 68 -> d/right, 87 -> w/up
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      break;
    case 83:
      break;
    case 68:
      // player.velocity.x = 0;
      keys.right.pressed = false;
      break;
    case 87:
      // player.velocity.y -= 20;
      break;
  }
});
