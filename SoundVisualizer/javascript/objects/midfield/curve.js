/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Curve = function () {

            this.curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3( -20, -5, 0 ),
                new THREE.Vector3( -10, 20, 0 ),
                new THREE.Vector3( 10, 20, 0),
                new THREE.Vector3( -10, -5, 0 )
            );

            this.geometry = new THREE.Geometry();
            this.geometry.vertices = this.curve.getPoints( 100 );

            var material = new THREE.LineBasicMaterial( { color : 0xff0000} );

            // Create the final Object3d to add to the scene
            this.mesh = new THREE.Line( this.geometry, material );

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Curve;
    }));