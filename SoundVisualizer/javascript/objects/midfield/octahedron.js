/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Octahedron = function () {

            this.radius = 50;

            this.geometry = new THREE.OctahedronGeometry(this.radius);

            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x00ff00, reflectivity:100, wireframe: true, transparent: true, opacity: 0.5} );

            this.mesh = new THREE.Mesh(this.geometry, material);

            this.mesh.name = "3dNoiseMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Octahedron;

    }));