/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Plane = function() {

            this.geometry = new THREE.PlaneBufferGeometry(100, 200, 32);
            var material = new THREE.MeshPhongMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                emissive: 0x000000,
                specular: 0x111111,
                shininess: 50,
                shading: THREE.SmoothShading,
                transparent: true,
                opacity: 0.75
                });

            this.mesh = new THREE.Mesh(this.geometry, material);
            this.mesh.name = "planeMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Plane;
    }));