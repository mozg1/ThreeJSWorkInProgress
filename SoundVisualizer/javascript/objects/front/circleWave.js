/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var circleWave = function () {


            this.geometry = new THREE.RingBufferGeometry( 128, 164, 32, 8 );

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0xffffff) }
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('line'),
                vertexShader: Shaders.getVertexShader('line'),
                wireframe: true,
                opacity: 0.5,
                transparent: true
            });

            shaderMaterial.skinning = true;

            this.mesh = new THREE.Mesh( this.geometry, shaderMaterial );
            this.mesh.name = "circleWaveMesh";

            this.getMesh = function() {
                return this.mesh;
            };


        };

        return circleWave;
    }));