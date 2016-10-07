/**
 * Created by PC1 on 28.06.2016.
 */

define(["three"],
    (function(THREE) {

        "use strict";

        var Shape = function() {

            this.circle = new THREE.Shape();
            this.radius = 5;

            for (var i = 0; i < 16; i++) {
                var pct = (i + 1) / 16;
                var theta = pct * Math.PI * 2.0;
                var x = this.radius * Math.cos(theta);
                var y = this.radius * Math.sin(theta);
                if (i == 0) {
                    this.circle.moveTo(x, y);
                } else {
                    this.circle.lineTo(x, y);
                }
            }

            this.geometry = this.circle.makeGeometry();
            this.material = new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                opacity: 0.5,
                transparent: true
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Shape;
    }));