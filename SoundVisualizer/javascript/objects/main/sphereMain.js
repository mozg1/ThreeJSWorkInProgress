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
                opacity: 1.0,
                transparent: true
            });

            var dot = new THREE.Geometry();

            for (var i = 0; i < this.geometry.attributes.position.array.length; i++) {
                dot.vertices.push(this.geometry.attributes.position.array[i]);
            }

            var dotMaterial = new THREE.PointsMaterial( { size: 35, sizeAttenuation: false, transparent: true } );
            dotMaterial.color.setRGB( 1,1,1);

            var particles = new THREE.Points( dot, dotMaterial );
            particles.sortParticles = true;

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial );
            this.mesh.name = "mainSphereMesh";

            console.log(this.geometry.attributes.position);


            this.getMesh = function() {
                return this.mesh;
            };

        };

        return SphereMain;

    })); // define module