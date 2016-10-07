/**
 * Created by PC1 on 10.08.2016.
 */

define(["three"],
    (function(THREE) {

        "use strict";

        var ConnectingLine = function(otherShapeCoordX, otherShapeCoordY) {

            this.circle = new THREE.Shape();
            this.radius = 5;

            this.circle.moveTo(0,0);
            this.circle.lineTo(0,1);
            if(otherShapeCoordX != 0) {
                this.circle.lineTo(otherShapeCoordX, otherShapeCoordY);
            }

            if(otherShapeCoordX == 0) {
                console.log("WARNING ! "+ otherShapeCoordX + "    " + otherShapeCoordY);

            }
            this.circle.lineTo(0,0);

            var points = this.circle.createPointsGeometry();
            this.line =  new THREE.Line( points, new THREE.LineBasicMaterial( { color: 0x2E0854, linewidth: 3, opacity: 0.9,
                transparent: true} ) );



            this.geometry = this.circle.makeGeometry();
            this.material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                opacity: 0.3,
                transparent: true
            });

            this.mesh = this.line; new THREE.Mesh(this.geometry, this.material);

            this.getMesh = function() {
                return this.line;
            };

        };

        return ConnectingLine;
    }));