/**
 * Created by PC1 on 03.08.2016.
 */
/**
 * Created by PC1 on 03.08.2016.
 */
/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Torus = function () {

            this.geometry = new THREE.TorusBufferGeometry( 30, 1, 52, 52 );

            console.log("Torus"+ this.geometry.attributes.position.count);

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0xffffff) }
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('central'),
                vertexShader: Shaders.getVertexShader('central'),
                wireframe: true
            });

            shaderMaterial.skinning = true;

            this.mesh = new THREE.Mesh( this.geometry, shaderMaterial );
            this.mesh.name = "mainTorusMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Torus;

    }));