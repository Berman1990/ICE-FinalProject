// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Player image
var PlayerReady = false;
var PlayerImage = new Image();
PlayerImage.onload = function () {
    PlayerReady = true;
};
PlayerImage.src = "images/Player.png";

// EndPoint image
var EndPointReady = false;
var EndPointImage = new Image();
EndPointImage.onload = function () {
    EndPointReady = true;
};
EndPointImage.src = "images/EndPoint.png";

// Game objects
var Player = {
    speed: 256 // movement in pixels per second
};
var EndPoint = {};

// Reset the game when the player catches a EndPoint
var reset = function (xPoint, yPoint) {

    Player.x = xPoint;
    Player.y = yPoint;

    PlayerRenderX = xPoint;
    PlayerRenderY= yPoint;

    Player.Rotate = 0;

    // Throw the EndPoint somewhere on the screen randomly
    EndPoint.x = 32 + (Math.random() * (canvas.width - 64));
    EndPoint.y = 32 + (Math.random() * (canvas.height - 64));
};

var update = function (modifier, Move, angle) {
    if (Move == 1) { // Player holding up
        Player.y += Player.speed * modifier;
    }
    if (Move == 2) { // Player holding down
        Player.y -= Player.speed * modifier;
    }
    if (Move == 3) { // Player holding left
        Player.x -= Player.speed * modifier;
    }
    if (Move == 4) { // Player holding right
        Player.x += Player.speed * modifier;
    }

    Player.Rotate = angle;

    // Are they touching?
    if (
        Player.x <= (EndPoint.x + 32)
        && EndPoint.x <= (Player.x + 32)
        && Player.y <= (EndPoint.y + 32)
        && EndPoint.y <= (Player.y + 32)
    ) {
        reset(canvas.width - PlayerImage.width, canvas.height - PlayerImage.height);
    }
};

var PlayerRenderRotate = 0;
var PlayerRenderX = 0;
var PlayerRenderY = 0;

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (PlayerReady) {
        ctx.save();
        if(PlayerRenderX!= Player.x)
        {
            if(PlayerRenderX < Player.x)
            {
                PlayerRenderX= PlayerRenderX+0.5;
            }
            else
            {
                PlayerRenderX= PlayerRenderX-0.5;
            }
        }
        if(PlayerRenderY!= Player.y)
        {
            if(PlayerRenderY < Player.y)
            {
                PlayerRenderY= PlayerRenderY+0.5;
            }
            else
            {
                PlayerRenderY= PlayerRenderY-0.5;
            }
        }
        ctx.translate(PlayerRenderX, PlayerRenderY);
        var TO_RADIANS = Math.PI / 180;
        if (PlayerRenderRotate != Player.Rotate) {
            if (PlayerRenderRotate < Player.Rotate) {
                PlayerRenderRotate = PlayerRenderRotate + 1;
            }
            else {
                PlayerRenderRotate = PlayerRenderRotate - 1;
            }
            if (PlayerRenderRotate == 360) {
                PlayerRenderRotate = 0;
                Player.Rotate =0;
            }
        }
        ctx.rotate(PlayerRenderRotate * TO_RADIANS);
        ctx.drawImage(PlayerImage, -(PlayerImage.width / 2), -(PlayerImage.height / 2));
        ctx.restore();
    }

    if (EndPointReady) {
        ctx.drawImage(EndPointImage, EndPoint.x, EndPoint.y);
    }

};

// The main game loop
var main = function () {
    var now = Date.now();

    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
// reset(canvas.width - PlayerImage.width, canvas.height - PlayerImage.height);
reset(canvas.width - PlayerImage.width, canvas.height - PlayerImage.height);
main();
