/**
 * Created by PC1 on 05.09.2016.
 */

define(["three"],
    (function(THREE) {

        "use strict";

        var Frontray = function () {

            this.geometry = new THREE.PlaneBufferGeometry(8192, 100, 200, 16);

            var material = new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                transparent: true,
           //     side: THREE.DoubleSide,
                opacity: 0.1} );

            this.mesh = new THREE.Mesh(this.geometry, material);

            this.mesh.name = "frontRayMesh";

            this.getMesh = function() {
                return this.mesh;
            };
        };

        return Frontray;

    }));