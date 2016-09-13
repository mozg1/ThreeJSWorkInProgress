/**
 * Created by PC1 on 03.08.2016.
 */
/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Floor = function () {

            this.geometry = new THREE.PlaneBufferGeometry(20000, 20000, 50, 50);
            this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
            this.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x551A8B) }
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('floor'),
                vertexShader: Shaders.getVertexShader('floor'),
                opacity:0.5,
                transparent: true,
                wireframe: true
            });

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial);

            this.mesh.name = "floorMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Floor;

    }));
