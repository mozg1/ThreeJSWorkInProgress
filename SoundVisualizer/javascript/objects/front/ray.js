define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Ray = function () {

            this.geometry = new THREE.PlaneBufferGeometry(4096, 1, 80, 16);

            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x00ff00, reflectivity:100} );

            this.mesh = new THREE.Mesh();

            this.mesh.name = "rayMesh";

            this.getMesh = function() {
                return this.mesh;
            };
        };

        return Ray;

    }));
