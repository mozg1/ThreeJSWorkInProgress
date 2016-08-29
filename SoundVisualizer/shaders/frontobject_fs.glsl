            varying vec3 vNormal;
 			varying vec2 vUv;

 			uniform vec3 color;
 			uniform sampler2D texture;

 			void main() {

 				gl_FragColor =  vec4( vec3( color ) * vec3( color ) - vec3(0.5,0.5,0.5), 1.0 );

 			}