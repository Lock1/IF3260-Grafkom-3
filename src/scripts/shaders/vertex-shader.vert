const code = `

attribute vec3 coordinates;
uniform float fudgeFactor;

uniform mat4 transformationMatrix;
uniform mat4 uProjectionMatrix;
varying float colorFactor;

void main(void) {
    vec4 transformedPos = transformationMatrix * vec4(coordinates.xy, coordinates.z * -1.0, 1.0);
    vec4 projectedPos   = uProjectionMatrix * transformedPos;
    if (fudgeFactor < 0.01)
        gl_Position = projectedPos;
    else {
        float zDivider = 2.0 + projectedPos.z * fudgeFactor;
        gl_Position = vec4(projectedPos.xy / zDivider, projectedPos.zw);
    }
    colorFactor = min(max((1.0 - transformedPos.z) / 2.0, 0.0), 1.0);
}



`
