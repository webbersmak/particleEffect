        (function () {
            "use strict";

            var points = [];
            var ctx = $("#canvas")[0].getContext("2d");
            ctx.fillStyle = "red";

            var minLow = 1 + Number.EPSILON;
            var minHigh = 1 - Number.EPSILON;
            var PI2 = 2 * Math.PI;

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function point() {
                this.x = 0;
                this.y = 0;
                this.dx = 0;
                this.dy = 0;
                //this.xDir = 1;
                this.size = 2;
                //this.m = 0;
                this.alpha = 0;
                this.origDist = 0;
                this.init(false);
            }

            point.prototype.init = function (dxOnly) {
                if (!dxOnly) {
                    this.x = getRandomInt(0, 64);
                    this.y = getRandomInt(0, 64);
                }
                this.dx = getRandomInt(0, 64);
                this.dy = getRandomInt(0, 64);
                this.dirX = (this.x > this.dx ? 1 : -1);
                this.dirY = (this.y > this.dy ? 1 : -1);
                this.origDist = this.distance();
            }

            point.prototype.distance = function () {
                return Math.round(Math.sqrt(Math.pow(this.dx - this.x, 2) + Math.pow(this.dy - this.y, 2)));
            }

            for (var i = 0; i < 128; i++) {
                points.push(new point());
            }

            function move(val) {
                var dist = val.distance();
                //document.title = dist;

                if (dist > Number.MIN_VALUE) {

                    var percentDone = ((val.origDist - dist) / val.origDist);
                    val.size = 3 * percentDone;
                    val.alpha = 1 - percentDone;

                    var newDist = dist - (dist * 0.1);
                    if (newDist < minLow || newDist < minHigh) {
                       // newDist = 1;
                    }
                    val.x = val.dx - (newDist * (val.dx - val.x)) / dist;
                    val.y = val.dy - (newDist * (val.dy - val.y)) / dist;
                }
                else {
                    //done!!!
                    val.init(true);
                }
            }

            function draw(val) {
                ctx.globalAlpha = val.alpha;
                //ctx.arc(1, 1, 10, 0, 2 * Math.PI);
                ctx.beginPath();
                ctx.arc(val.x, val.y, val.size, 0, PI2);
                ctx.closePath();
                ctx.fill();
                //ctx.fillRect(val.x, val.y, val.size, val.size);
                ctx.globalAlpha = 1;
            }

            function update() {

                points.forEach(move);
                ctx.clearRect(0, 0, 426, 240);
                points.forEach(draw);

                setTimeout(update, 42);
            };

            update();
        })();
