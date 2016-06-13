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
                        {src: "Eskimo.png", id: "player"},
                        {src: "Igloo.png", id: "end"},
                        {src: "wall.png", id: "wall"}
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
                    DrawGrid();
                    player = new createjs.Bitmap(loader.getResult("player"));
                    player.regX = player.image.width / 2;
                    player.regY = player.image.height / 2;

                    player.x = GetStartPoint.x + player.regX;
                    player.y = GetStartPoint.y + player.regY;
                    player.rotateTo = GetStartPoint.direction + (360 * 2);
                    player.xTo = player.x;
                    player.yTo = player.y;
                    player.rotation = player.rotateTo;
                    player.stepSize = 50;
                    player.isReady = true;

                    scope.stage.addChild(player);

                    endPoint = new createjs.Bitmap(loader.getResult("end"));

                    endPoint.regX = endPoint.image.width / 2;
                    endPoint.regY = endPoint.image.height / 2;

                    endPoint.x = GetEndPoint.x + endPoint.regX;
                    endPoint.y = GetEndPoint.y + endPoint.regY;

                    scope.stage.addChild(endPoint);

                    DrawWalls(GetWallsArray);


                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.addEventListener("tick", tick);
                }

                var GetWallsArray;
                var GetStartPoint;
                var GetEndPoint;

                scope.playerControls.InitGame = function (data, WallsArray) {
                    GetStartPoint = data.startPoint;
                    GetEndPoint = data.endPoint;
                    GetWallsArray = WallsArray;
                }

                scope.playerControls.ResetGame = function () {
                    player.x = GetStartPoint.x + player.regX;
                    player.y = GetStartPoint.y + player.regY;
                    player.rotateTo = GetStartPoint.direction + (360 * 2);
                    player.xTo = player.x;
                    player.yTo = player.y;
                    player.rotation = player.rotateTo;
                    player.isReady = true;
                }

                function DrawGrid()
                {
                    var square;
                    for (var x = 0; x < 10; x++)
                    {
                        for (var y = 0; y < 10; y++)
                        {
                            square = new createjs.Shape();
                            square.graphics.beginStroke("#d8d8d8")
                            square.graphics.drawRect(0, 0, 50, 50);
                            square.x = x * 50;
                            square.y = y * 50;
                            scope.stage.addChild(square);
                        }
                    }
                }

                function DrawWalls(WallsArray) {
                    var i;
                    var Index = 0;
                    for (i = 0; i < WallsArray.length; i++) {

                        if (WallsArray[i].startPnt.x != WallsArray[i].endPnt.x) {
                            var x;
                            for (x = WallsArray[i].startPnt.x; x < WallsArray[i].endPnt.x; x++) {
                                wallsArray[Index] = new createjs.Bitmap(loader.getResult("wall"));
                                wallsArray[Index].x = x;
                                wallsArray[Index].y = WallsArray[i].startPnt.y;
                                scope.stage.addChild(wallsArray[Index]);
                                Index++;
                            }
                        }
                        else {
                            var y;
                            for (y = WallsArray[i].startPnt.y; y < WallsArray[i].endPnt.y; y++) {
                                wallsArray[Index] = new createjs.Bitmap(loader.getResult("wall"));
                                wallsArray[Index].x = WallsArray[i].startPnt.x;
                                wallsArray[Index].y = y;
                                scope.stage.addChild(wallsArray[Index]);
                                Index++;
                            }
                        }
                    }
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

                var wallsArray = new Array;

                function tick(event) {
                    // Are they touching?
                    if (ndgmr.checkRectCollision(player, endPoint) && player.isReady) {
                        console.log('done!');
                        player.isReady = false;

                        if (scope.playerControls.finishLevel) {
                            scope.playerControls.finishLevel();
                        }

                        clearTimeout(scope.timeout);
                    }

                    var i;
                    for (i = 0; i < wallsArray.length; i++) {
                        if (ndgmr.checkRectCollision(player, wallsArray[i])) {
                            player.xTo = player.x;
                            player.yTo = player.y;
                            clearTimeout(scope.timeout);
                        }
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