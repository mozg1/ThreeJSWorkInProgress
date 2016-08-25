      uniform float amplitude;
	  attribute float displacement;
      uniform float time;

	  varying vec3 vNormal;
	  varying vec2 vUv;

      varying vec3 vertPos;

      void main(void) {
      	vNormal = normal;
		vUv = uv;

        vec3 newPosition = position + amplitude * normal * vec3( displacement );

		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        vec4 vertPos4 =  modelViewMatrix * vec4(newPosition, 1.0);

        vertPos = vec3(vertPos4) / vertPos4.w;
    //    normalInterp = vec3(normalMat * vec4(inputNormal, 0.0));

      }


/*


attribute vec3 inputPosition;
attribute vec2 inputTexCoord;
attribute vec3 inputNormal;

uniform mat4 projection, modelview, normalMat;

varying vec3 normalInterp;
varying vec3 vertPos;

void main(){
    gl_Position = projection * modelview * vec4(inputPosition, 1.0);
    vec4 vertPos4 = modelview * vec4(inputPosition, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(normalMat * vec4(inputNormal, 0.0));
}

*/







/*	  uniform float amplitude;
	  attribute float displacement;
      uniform float time;

	  varying vec3 vNormal;
	  varying vec2 vUv;

      varying vec3 viewDir;
      varying vec4 vPosition;


      void main(void) {
      	vNormal = normal;
		vUv = uv;

		vPosition = modelViewMatrix * vec4(position, 1.0);

		bool useOrtho = projectionMatrix[2][3] < 0.1;
        viewDir = useOrtho ? vec3(0, 0, 1) : normalize(-vPosition.xyz);

        vec3 newPosition = vPosition + normal * vec3( displacement );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

      }
*/
// https://www.google.de/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=pass%20array%20to%20shader%2C%20set%201%20element%20to%201%20vertex