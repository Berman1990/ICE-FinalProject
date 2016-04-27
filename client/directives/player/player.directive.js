angular.module('myApp.level.player', [])
    .directive('codePlayer', function() {
        return {
            restrict: 'E',
            templateUrl: 'directives/player/player.directive.html', // just an empty DIV element
            replace: true,
            scope: {
                // stage: '=',
                playerControls: '=controls'
            },
            link: function(scope, element, attrs) {
                var w, h, loader, manifest, player;

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
                        { src: "ice_small.png", id: "player" }
                    ];
                    loader = new createjs.LoadQueue(false);
                    loader.addEventListener("complete", handleComplete);
                    loader.loadManifest(manifest, true, "/images/");
                }

                function handleComplete() {
                    player = new createjs.Bitmap(loader.getResult("player"));

                    scope.stage.addChild(player);
                    // scope.stage.addEventListener("gadi", rotatePalyer);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.addEventListener("tick", tick);
                }

                scope.playerControls.moveByX = function(x) {
                    player.moveByX = 90;
                }

                function tick(event) {
                    var deltaS = event.delta / 1000;
                    var position = player.x + 150 * deltaS;
                    var grantW = player.getBounds().width * player.scaleX;
                    player.x = (position >= w + grantW) ? -grantW : position;

                    scope.stage.update(event);
                }


            }
        }


    });