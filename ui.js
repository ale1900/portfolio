const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let input = document.getElementById('modalEl');

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    const imageRight = new Image();
    imageRight.src = "./img/spriteStandRight.png";
    this.imageRight = imageRight;

    const imageLeft = new Image();
    imageLeft.src = "./img/spriteStandLeft.png";
    this.imageLeft = imageLeft

    this.width = 78;
    this.height = 177;
    this.frames = 0
  

  }
  draw() {

    c.drawImage(this.imageRight,
      177 * this.frames,
      0,
      177,
      400, 
      this.position.x, 
      this.position.y, 
      this.width, 
      this.height
      );
  }

  update() {
    this.frames++
    if(this.frames > 28) this.frames = 0
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

class GenericImage {
  constructor({ x, y, src }) {
    this.position = {
      x,
      y,
    };
    this.src = src;

    const image = new Image();
    image.src = this.src;

    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Platform {
  constructor({ x, y, src }) {
    this.position = {
      x,
      y,
    };
    this.src = src

    const image = new Image();
    image.src = this.src;

    this.image = image;
    this.width = 550;
    this.height = 20;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

let sound = new Howl({
  src: ['./audio/ambiente.wav'],
  autoplay: true,
  loop: true,
  volume: 0.03,
});

let soundJump = new Howl({
  src: ['./audio/jump.mp3'],
  volume: 0.05,
});

let soundLose = new Howl({
  src: ['./audio/lose.mp3'],
  volume: 0.1,
  loop: false,
});

let soundWin = new Howl({
  src: ['./audio/win.mp3'],
  loop: false,
  volume: 0.05,
});

class PlatformCloud {
  constructor({ x, y, src }) {
    this.position = {
      x,
      y,
    };
    this.src = src

    const image = new Image();
    image.src = this.src;

    this.image = image;
    this.width = 230;
    this.height = 50;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function init() {
  input.style.display = 'none';
  player = new Player();
  platforms = [
    new Platform({ x: -1, y: 470, src: "./img/platform.png"  }),
    new Platform({ x: 579, y: 470, src: "./img/platformTopRight.png"  }),
    new Platform({ x: 1400, y: 470, src: "./img/platformTopLeft.png"  }),
    new Platform({ x: 1979, y: 470, src: "./img/platformTopRight.png"  }),
    new Platform({ x: 2800, y: 470, src: "./img/platformTopLeft.png"  }),
    new Platform({ x: 3379, y: 470, src: "./img/platform.png"  }),
    new Platform({ x: 3958, y: 470, src: "./img/platformTopRight.png"  }),
    new Platform({ x: 4800, y: 470, src: "./img/platformTopLeft.png"  }),
    new Platform({ x: 5379, y: 470, src: "./img/platform.png"  }),
    new Platform({ x: 5958, y: 470, src: "./img/platformTopRight.png"  }),
   
  ];

  platformsCloud = [
    new PlatformCloud({ x: 1000, y: 290, src: "./img/platformCloud.png" }),
    new PlatformCloud({ x: 2500, y: 290, src: "./img/platformCloud.png" }),
    new PlatformCloud({ x: 6730, y: 390, src: "./img/platformCloud.png" }),
    new PlatformCloud({ x: 7200, y: 290, src: "./img/platformCloud.png" }),
    new PlatformCloud({ x: 7870, y: 190, src: "./img/platformCloud.png" }),
  ];

  hills = [
    new GenericImage({ x: -1, y: -50, src: "./img/hills.png" }),
  ];

  background = new GenericImage({ x: -1, y: -1, src: "./img/background.png" });

  scrollOffset = 0;
}

let player = new Player();
let platforms = [];
let background = new GenericImage({
  x: -1,
  y: -1,
  src: "./img/background.png",
});
let hills = [];
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};



let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.draw();
  hills.forEach((hills) => {
    hills.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  platformsCloud.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) 
  || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      hills.forEach((hills) => {
        hills.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      hills.forEach((hills) => {
        hills.position.x += player.speed * 0.66;
      });
    }
  }

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) 
  || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platformsCloud.forEach((platform) => {
        platform.position.x -= player.speed; 
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      
      platformsCloud.forEach((platform) => {
        platform.position.x += player.speed;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
      //platform collision
    ) {
      player.velocity.y = 0;
    }
  });

  platformsCloud.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
      //platform collision
    ) {
      player.velocity.y = 0;
    }
  });

  // win condition
  if (scrollOffset > 14550) {
    input.style.display = 'flex';
  } else input.style.display = 'none';
  
  //lose condition
  if (player.position.y > canvas.height) {
    soundLose.play();
    init();
  }
}

init();
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 32:
      console.log("up");
      player.velocity.y -= 25;
      soundJump.play();
      break;
    case 40:
      console.log("down");
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 39:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 32:
      console.log("up");
      break;
    case 40:
      console.log("down");
      break;
  }
});

