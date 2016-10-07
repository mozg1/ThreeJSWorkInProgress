/**
 * Created by PC1 on 14.09.2016.
 */
define(["three"],
    (function(THREE) {

        "use strict";

        var orbitalSphere = function(rad, color, opacity) {

            var segments = 24, rings = 24;

            this.geometry = new THREE.SphereGeometry(rad, segments, rings);

            var material = new THREE.MeshLambertMaterial({
                color: color,
                reflectivity:50,

                wireframe: true,
                opacity: opacity,
                transparent: true
            });

            this.mesh = new THREE.Mesh(this.geometry, material );
            this.mesh.name = "orbitalMesh";


            this.getMesh = function() {
                return this.mesh;
            };

        };

        return orbitalSphere;

    })); // d