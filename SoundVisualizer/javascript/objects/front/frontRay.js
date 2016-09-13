/**
 * Created by PC1 on 05.09.2016.
 */

define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Frontray = function () {

            this.geometry = new THREE.PlaneBufferGeometry(4096, 100, 200, 16);

            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x00ff00, reflectivity:100} );

            this.mesh = new THREE.Mesh(this.geometry, material);

            this.mesh.name = "frontrayMesh";

            this.getMesh = function() {
                return this.mesh;
            };
        };

        return Frontray;

    }));