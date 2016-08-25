/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var SphereMain = function() {

            var radius = 50, segments = 24, rings = 24;

            this.geometry = new THREE.SphereBufferGeometry(radius, segments, rings);

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            console.log(displacement.length);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x000000) },
                texture: {value: new THREE.TextureLoader().load("./textures/arthur.jpg")}
         //       freqScale: {type: "f", value: 0.5},
         //       colorScale: {type: "f", value: 1}
            };

            var attributes = this.geometry.attributes;
            console.log(attributes);

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('sphere'),
                vertexShader: Shaders.getVertexShader('sphere'),
                wireframe: true,
                opacity: 0.5,
                transparent: true
            });

            /*
                        var shaderMaterial = new THREE.ShaderMaterial({
                            uniforms: THREE.UniformsUtils.merge([
                                THREE.ShaderLib['phong'],
                                {
                                    diffuseMaterial: {type: 'c', value: new THREE.Color(1, 1, 1)},
                                    specularMaterial: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                                    ambientMaterial: {type: 'c', value: new THREE.Color(0.8, 0.2, 0.2)},
                                    shininessMaterial: {type: 'f', value: 16.0}
                                }]),
                            fragmentShader: Shaders.getFragmentShader('sphere'),
                            vertexShader: Shaders.getVertexShader('sphere'),
                            lights: true,
                            wireframe: true

                        });
                        */

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial );
            this.mesh.name = "sphereMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return SphereMain;

    })); // define module