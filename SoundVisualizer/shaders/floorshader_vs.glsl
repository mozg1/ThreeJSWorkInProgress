	  attribute float displacement;
      uniform float time;

	  varying vec3 vNormal;
	  varying vec2 vUv;

      varying vec3 vertPos;

      void main() {
      	vNormal = normal;
		vUv = uv;

        vec3 newPosition = position + normal * vec3( displacement );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

        vec4 vertPos4 = modelViewMatrix * vec4(newPosition, 1.0);
        vertPos = vec3(vertPos4) / vertPos4.w;
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