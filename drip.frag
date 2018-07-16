// Shader by Gene Kogan
// https://github.com/genekogan/Processing-Shader-Examples

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float intense;
uniform float speed;
uniform vec2 graininess;
uniform vec3 u_mouse1;
uniform vec3 u_mouse2;

const float offset = 20.0;
const int complexity = 15;
const float Pi = 3.14159;

void main(){
  	vec2 p=(2.0 * gl_FragCoord.xy - u_resolution) / max(u_resolution.x, u_resolution.y);

  	for(int i = 1; i < complexity; i++){
    	vec2 newp = p;
    	newp.x += graininess.x / float(i) * sin(float(i) * p.y + u_time / speed + 0.3 * float(i)) + offset;
    	newp.y += graininess.y / float(i) * sin(float(i) * p.x + u_time / speed + 0.3 * float(i + 100)) + offset;
    	p = newp;
  	}
  	vec3 col = vec3(intense * sin(3.0 * p.x) + intense, 
	  			  	intense * sin(3.0 * p.y) + intense, 
	  			  	intense * sin(p.x + p.y) + intense);
	col.g = col.r;
	col.b = col.r;

    vec3 color1 = vec3(u_mouse1);
    vec3 color2 = vec3(u_mouse2);

    vec3 gradient = mix(color1, color2, col);

  	gl_FragColor=vec4(gradient, 1.0);
}