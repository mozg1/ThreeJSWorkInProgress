/**
 * Created by PC1 on 28.06.2016.
 */

define(["three"],
    (function(THREE) {

        "use strict";

        var Shape = function() {

            var circle = new THREE.Shape();
            this.radius = 5;

            for (var i = 0; i < 16; i++) {
                var pct = (i + 1) / 16;
                var theta = pct * Math.PI * 2.0;
                var x = this.radius * Math.cos(theta);
                var y = this.radius * Math.sin(theta);
                if (i == 0) {
                    circle.moveTo(x, y);
                } else {
                    circle.lineTo(x, y);
                }
            }

            this.geometry = circle.makeGeometry();
            this.material = new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                opacity: 0.5,
                transparent: true
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);

            this.getMesh = function() {
                return this.mesh;
            };

            this.setRadius = function(radius) {
                this.radius = radius;
            };

            this.writeShit = function() {
                console.log("shit");
            }
        };

        return Shape;
    }));