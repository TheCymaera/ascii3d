import { RenderBuffer } from "../../ascii3d.js";
import * as cube from "../models/cube.js";
import * as rgbaShader from "../shaders/rgba.js";
import { mat4 } from "../gl-matrix/index.js";
import * as utilities from "../utilities.js";

// canvas dimensions (in letters), font size, and letter spacing
const width = 50, height = 50, fontSize = 32, letterSpacing = fontSize * 0.8;

// prepare canvas
const myCanvas = document.querySelector("canvas")!;
myCanvas.width = width*letterSpacing;
myCanvas.height = height*letterSpacing;

// prepare rendering context
const ctx = myCanvas.getContext("2d")!;
ctx.font = `${fontSize}px monospace`;

// create render buffer
const renderBuffer = new RenderBuffer(width,height);

// Create matrices: model * view * projection = transformation
const model = mat4.create();
const view = mat4.lookAt(new Float32Array(16), [0, 0, -8], [0, 0, 0], [0, 1, 0]);
const projection = mat4.perspective(new Float32Array(16), Math.PI/4, 1, 0.1, 1000.0);

function tickly() {
	const angle = performance.now() / 1000 / 6 * 2 * Math.PI;
	
	// rotate model matrix
	mat4.identity(model);
	mat4.rotate(model, model, angle, [0, 1, 0]);
	mat4.rotate(model, model, angle/4, [1, 0, 0]);
	
	// transformation = model * view * projection
	mat4.mul(rgbaShader.uniforms.transform, projection, view);
	mat4.mul(rgbaShader.uniforms.transform, rgbaShader.uniforms.transform, model);
	
	// clear buffer
	renderBuffer.clear();

	// draw triangles to buffer
	renderBuffer.drawTriangles(cube.vertices, rgbaShader.vertex, rgbaShader.fragment, true);

	// render the buffer to an HTML canvas
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	renderBuffer.renderToCanvas(
		ctx, 			// CanvasRenderingContext2D
		letterSpacing, 	// letter spacing
		0, 0 			// optional: start position (from bottom left)
	);
};

utilities.tickly(tickly);