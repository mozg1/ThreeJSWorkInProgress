define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var frontalPlane = function () {

            this.geometry = new THREE.PlaneBufferGeometry(1000, 1000, 1000, 16);

            var material = new THREE.MeshLambertMaterial( {
                color: 0xffffff, transparent : true,
                opacity: 0.0,
                side: THREE.DoubleSide
            } );

            this.mesh = new THREE.Mesh(this.geometry,
                material);

            this.mesh.name = "frontalPlaneMesh";

            this.getMesh = function() {
                return this.mesh;
            };
        };

        return frontalPlane;

    }));
