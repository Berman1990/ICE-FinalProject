angular.module('myApp.level.player', [])
    .directive('codePlayer', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/player/player.directive.html', // just an empty DIV element
            replace: true,
            scope: {
                // stage: '=',
                playerControls: '=controls'
            },
            link: function (scope, element, attrs) {
                var w, h, loader, manifest, player, endPoint;

                drawGame();

                function drawGame() {
                    //drawing the game canvas from scratch here
                    //In future we can pass stages as param and load indexes from arrays of background elements etc
                    if (scope.stage) {
                        scope.stage.autoClear = true;
                        scope.stage.removeAllChildren();
                        scope.stage.update();
                    } else {
                        scope.stage = new createjs.Stage(element[0]);
                    }
                    w = scope.stage.canvas.width;
                    h = scope.stage.canvas.height;
                    manifest = [
                        {src: "ice_small.png", id: "player"},
                        {src: "ice_small.png", id: "end"}
                    ];
                    loader = new createjs.LoadQueue(false);
                    loader.addEventListener("complete", handleComplete);
                    loader.loadManifest(manifest, true, "/images/");
                }

                scope.playerControls.setCommandArray = function (commands) {
                    var i = 0;

                    function doNextCommands() {
                        if (player.isReady) {
                            scope.playerControls.update(commands[i]);
                            i++;
                        }
                        scope.timeout = setTimeout(doNextCommands, 100);
                    };

                    doNextCommands();
                };

                function handleComplete() {
                    player = new createjs.Bitmap(loader.getResult("player"));
                    player.regX = player.image.width / 2;
                    player.regY = player.image.height / 2;

                    player.x = 50;
                    player.y = 50;
                    player.rotateTo = 0;
                    player.xTo = player.x;
                    player.yTo = player.y;
                    player.rotation = 0;
                    player.stepSize = 30;
                    player.isReady = true;

                    scope.stage.addChild(player);

                    endPoint = new createjs.Bitmap(loader.getResult("end"));

                    endPoint.regX = endPoint.image.width / 2;
                    endPoint.regY = endPoint.image.height / 2;

                    endPoint.x = 250;
                    endPoint.y = 50;

                    scope.stage.addChild(endPoint);

                    // scope.stage.addEventListener("gadi", rotatePalyer);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.addEventListener("tick", tick);
                }

                scope.playerControls.update = function (command) {

                    if (command == 1) {
                        if (Math.abs(player.rotateTo % 360) == 0) {
                            player.yTo -= player.stepSize;
                        }
                        else if (Math.abs(player.rotateTo % 360) == 90) {
                            player.xTo += player.stepSize;
                        }
                        else if (Math.abs(player.rotateTo % 360) == 180) {
                            player.yTo += player.stepSize;
                        }
                        else if (Math.abs(player.rotateTo % 360) == 270) {
                            player.xTo -= player.stepSize;
                        }
                    }
                    else if (command == 2) {
                        player.rotateTo += 90;
                    }
                    else if (command == 3) {
                        player.rotateTo -= 90;
                    }



                }

                function tick(event) {
                    //var deltaS = event.delta / 1000;
                    //var position = player.x + 150 * deltaS;
                    //var grantW = player.getBounds().width * player.scaleX;
                    //player.x = (position >= w + grantW) ? -grantW : position;

                    // Are they touching?
                    if (ndgmr.checkRectCollision(player,endPoint)) {
                        //reset(canvas.width - playerImage.width, canvas.height - playerImage.height);
                        console.log('done!');
                        clearTimeout(scope.timeout);
                    }

                    if (player.rotation < player.rotateTo) {
                        player.rotation++;
                    }
                    else if (player.rotation > player.rotateTo) {
                        player.rotation--;
                    }

                    if (player.x < player.xTo) {
                        player.x++;
                    }
                    else if (player.x > player.xTo) {
                        player.x--;
                    }

                    if (player.y < player.yTo) {
                        player.y++;
                    }
                    else if (player.y > player.yTo) {
                        player.y--;
                    }

                    if (player.x === player.xTo &&
                        player.y === player.yTo &&
                        player.rotation === player.rotateTo) {
                        player.isReady = true;
                    }
                    else {
                        player.isReady = false;
                    }

                    scope.stage.update(event);
                }


            }
        }


    });