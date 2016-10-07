	  attribute float displacement;

	  varying vec3 vNormal;
	  varying vec2 vUv;

      varying vec3 vertPos;

      void main(void) {
        vNormal = normal;
		vUv = uv;

        vec3 newPosition = position + normal * vec3( displacement );

		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        

        vertPos = vec3(gl_Position) / gl_Position.w;
      }