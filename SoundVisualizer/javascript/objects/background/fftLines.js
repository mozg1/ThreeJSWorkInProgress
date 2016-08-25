/**
 * Created by PC1 on 09.08.2016.
 */

/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var fftLines = function() {

            var freqBuffer = new Uint8Array(8192);

            /* Add lines */

            var material = new THREE.MeshPhongMaterial({
                color: 0x000000,
                opacity: 0.5,
                transparent: true
            });


            var geometry = new THREE.Geometry();

            for(var i= 0,x=-3620; i<freqBuffer.length*4; i+=4) {
                geometry.vertices.push(
                    new THREE.Vector3( x, 0, 0 ),
                    new THREE.Vector3( x, 0, 0 ),
                    new THREE.Vector3( x+=2, 0, 0 ),
                    new THREE.Vector3( x, 0, 0 )
                );
                x++;
            }

            this.line = new THREE.LineSegments( geometry, material );


            this.updateVertices = function() {
                var geometry = this.line.geometry;

                for(var i= 0,x=-3620; i<freqBuffer.length*4; i+=1) {

                    var j = i;

                    geometry.vertices[i] =  new THREE.Vector3( x, 0, -2000 );
                    geometry.vertices[i+=1] = new THREE.Vector3( x, freqBuffer[j]*4, -2000 );
                    geometry.vertices[i+=1] =  new THREE.Vector3( x+=2, 0, -2000 );
                    geometry.vertices[i+=1] = new THREE.Vector3( x, freqBuffer[j]*4, -2000 );

                    x+=2;
                }

            };

            this.setFrequencyPosition = function(freqByteData) {
                for(var i = 0; i<freqBuffer.length; i++) {
                    freqBuffer[i] = freqByteData[i];
                }

                this.updateVertices();
            };

            this.colorVertices = function() {
                var geometry = this.line.geometry;
                geometry.vertexColors = new THREE.Color( 0xff0000 );

            };

            this.mesh = new THREE.Mesh(this.line.geometry, new THREE.MeshPhongMaterial({
           /*
                color: 0xffffff,
                emissive: 0xd3d3d3,
                specular: 0x000000,
                shininess: 50,
                shading: THREE.SmoothShading,
                opacity: 0.1,
                transparent: true
           */
            }));

            this.mesh.name = "fftLinesMesh";

            this.getMesh = function() {
                return this.line;
            };

        };

        return fftLines;

    }));