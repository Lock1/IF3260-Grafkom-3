const code = `

precision mediump float;
uniform vec3 userColor;
varying float colorFactor;

void main(void) {
    gl_FragColor = vec4(userColor, 1.0);
}



`;
