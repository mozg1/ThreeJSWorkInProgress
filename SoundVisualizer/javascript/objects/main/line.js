/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Line = function () {

            this.geometry = new THREE.PlaneBufferGeometry(8192, 1, 512, 16);
            this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x000000) }
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('line'),
                vertexShader: Shaders.getVertexShader('line'),
                side: THREE.DoubleSide
            });

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial);

            this.mesh.name = "lineMesh";

            this.getMesh = function() {
                return this.mesh;
            };


        };

        return Line;

    }));
