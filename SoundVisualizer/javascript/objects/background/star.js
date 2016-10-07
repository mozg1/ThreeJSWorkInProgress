/**
 * Created by PC1 on 14.09.2016.
 */
define(["three"],
    (function(THREE) {

        "use strict";

        var Star = function (radius) {

            this.geometry = new THREE.IcosahedronGeometry(radius);

            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x00ff00, reflectivity:100, wireframe: true, transparent: true, opacity: 0.5} );

            this.mesh = new THREE.Mesh(this.geometry, material);

            this.mesh.name = "starMesh";

            this.getMesh = function() {
                return this.mesh;
            };


        };

        return Star;

    }));
