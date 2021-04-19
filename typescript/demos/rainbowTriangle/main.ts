import { RenderBuffer, VertexArray } from "../../ascii3d.js";
import * as rgbShader from "../shaders/rgba-2d.js";

// canvas dimensions (in letters), font size, and letter spacing
const width = 50, height = 50, fontSize = 32, letterSpacing = fontSize * 0.8;

// prepare canvas
const myCanvas = document.querySelector("canvas")!;
myCanvas.width = width*letterSpacing;
myCanvas.height = height*letterSpacing;

// prepare rendering context
const ctx = myCanvas.getContext("2d")!;
ctx.font = `${fontSize}px monospace`;

// define vertex array
const vertices: VertexArray<rgbShader.RGBAVertex> = [
	[0.0, 0.5, 1.0, 1.0, 0.0, "A".charCodeAt(0)],
	[-.5, -.5, 0.7, 0.0, 1.0, "G".charCodeAt(0)],
	[0.5, -.5, 0.1, 1.0, 0.6, "Y".charCodeAt(0)]
]

// create render buffer
const renderBuffer = new RenderBuffer(width,height);

// draw triangles to buffer
renderBuffer.drawTriangles(vertices, rgbShader.vertex, rgbShader.fragment);

// render the buffer to an HTML canvas
renderBuffer.renderToCanvas(
	ctx, 			// CanvasRenderingContext2D
	letterSpacing, 	// letter spacing
	0, 0 			// optional: start position (from bottom left)
);