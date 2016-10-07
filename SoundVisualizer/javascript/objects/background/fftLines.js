/**
 * Created by PC1 on 09.08.2016.
 */

/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var fftLines = function() {

            var freqBuffer = new Uint8Array(8192);

            /* Add lines */

            var material = new THREE.MeshPhongMaterial({
                opacity: 0.5,
                transparent: true,
                vertexColors: THREE.VertexColors
            });


            var geometry = new THREE.Geometry();

            for(var j= 0,x=-5620; j<8192; j++, x++) {
                if(j < sectionArray[5]) {
                    geometry.vertices.push(
                        new THREE.Vector3( x, 0, 0 ),
                        new THREE.Vector3( x, 0, 0 ),
                        new THREE.Vector3( x+=1, 0, 0 ),
                        new THREE.Vector3( x, 0, 0 )
                    );
                } else {
                    geometry.vertices.push(
                        new THREE.Vector3( x, 0, 0 ),
                        new THREE.Vector3( x, 0, 0 )
                    );
                }


                if(j < sectionArray[0]) {       // Subbass
                    geometry.colors.push(new THREE.Color(0xffffff),
                        new THREE.Color(0xffffff),
                        new THREE.Color(0xffffff),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[0] && j < sectionArray[1]) {       // Bassband
                    geometry.colors.push(new THREE.Color(0xBBDEFB), // 0xBBDEFB 0xd3d3d3
                        new THREE.Color(0xffffff),
                        new THREE.Color(0xBBDEFB),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[1] && j < sectionArray[2]) {       // Low-Mid
                    geometry.colors.push(new THREE.Color(0x90CAF9), // 0x90CAF9 0xffff99
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x90CAF9),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[2] && j < sectionArray[3]) {       // Mid
                    geometry.colors.push(new THREE.Color(0x64B5F6), // 0x64B5F6 0xff00ff
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x64B5F6),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[3] && j < sectionArray[4]) {        // Upper-Mid
                    geometry.colors.push(new THREE.Color(0x42A5F5), // 0x42A5F5 0xff0000
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x42A5F5),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[4] && j < sectionArray[5]) {       // High
                    geometry.colors.push(new THREE.Color(0x2196F3), // 0x2196F3 0x00ff00
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x2196F3),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[5] && j < sectionArray[6]) {   // Ultrahigh
                    geometry.colors.push(new THREE.Color(0x1E88E5), // 0x1E88E5
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= sectionArray[6] && j < sectionArray[7]) {   // Inaudible
                    geometry.colors.push(new THREE.Color(0x1565C0), // 0x1565C0 0x0000ff
                        new THREE.Color(0xffffff)
                    );
                }
            }

            console.log(geometry.colors.length + "   vertices: " + geometry.vertices.length);
            this.line = new THREE.LineSegments( geometry, material );

            this.updateVertices = function() {
                var geometry = this.line.geometry;

                for(var i= 0, j= 0,x=-5620; j<8192; i++, j++, x++) {

                    if(j < sectionArray[5]) {
                        geometry.vertices[i] = new THREE.Vector3(x, 0, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x, freqBuffer[j] * 5, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x += 1, 0, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x, freqBuffer[j] * 5, -4500);
                    } else {
                        geometry.vertices[i] = new THREE.Vector3(x, 0, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x, freqBuffer[j] * 5, -4500);
                    }
                }
            };

            this.setFrequencyPosition = function(freqByteData) {
                for(var i = 0; i<freqByteData.length; i++) {
                    freqBuffer[i] = freqByteData[i];
                }

                this.updateVertices();
            };

            this.colorVertices = function() {
                var geometry = this.line.geometry;
                geometry.vertexColors = new THREE.Color( 0xff0000 );
            };

            this.mesh = new THREE.Mesh(this.line.geometry, new THREE.MeshPhongMaterial({

            }));

            this.mesh.name = "fftLinesMesh";

            this.line.name = "fftLinesMesh";

            this.getMesh = function() {
                return this.line;
            };

        };

        return fftLines;

    }));