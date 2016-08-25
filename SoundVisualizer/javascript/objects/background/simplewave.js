/**
 * Created by Alexander Zorin on 22.06.2016.
 */

// http://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically
// http://stackoverflow.com/questions/19737031/loading-scripts-after-page-load



define(["three"],
    (function(THREE) {

        "use strict";


        var Simplewave = function() {

            // geometry
            var geometry = new THREE.BufferGeometry();
    //        var material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );
            var material = new THREE.MeshBasicMaterial( { //MeshBasicMaterial / PointsMaterial
                color: color,
                size: 10, vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide,
                wireframe: true
            } );

            this.mesh = new THREE.Mesh(geometry, material);

            this.getMesh = function() {
                return this.mesh;
            };

            // color
            var color = new THREE.Color();
            color.setRGB( 0, 255, 0 );


            var positions = new Float32Array( bufferLength * 3 ); // 3 vertices per point
            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

            this.addAttribute = function(name, buffer) {
                this.geometry.addAttribute(name, new THREE.BufferAttribute(buffer, 3));
                this.geometry.computeBoundingSphere();

                //this.mesh = new THREE.Points( this.geometry, this.material );
                this.mesh = new THREE.Mesh(this.geometry, this.material);

                this.setIndex = function (buffer) {
                    this.geometry.setIndex(new THREE.BufferAttribute(buffer, 1));
                };

                this.setSegments = function ( buffer) {
                    this.geometry.segments = buffer;
                };
            };

            // draw range
            var drawCount = 2; // draw the first 2 points, only
            geometry.setDrawRange( 0, drawCount );

            // material

            // line
            var line = new THREE.Line( geometry,  material );

            this.positions = line.geometry.attributes.position.array;

            var y,index = 0;

            var WIDTH, HEIGHT = 5;

            var sliceWidth = WIDTH * 1.0 / bufferLength;

            for(var i = 0, x= 0, z=0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                y = v * HEIGHT/2;

                if(i === 0) {
                //    canvasCtx.moveTo(x, y);

                } else {
                //    canvasCtx.lineTo(x, y);
                }


                this.positions[ i ]     = x;
                this.positions[ i + 1 ] = y;
                this.positions[ i + 2 ] = z;

                x += sliceWidth;
            }

            line.geometry.attributes.position.needsUpdate = true; // required after the first render

            this.getPositions = function() {
                return this.positions;
            };


        };



        return Simplewave;
    }));