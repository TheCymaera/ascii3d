import { RenderBuffer } from "../../ascii3d.js";
import { Camera } from "../utilities.js";
import * as rgbaShader from "../shaders/rgba.js";
import * as waterShader from "../shaders/water.js";
import { vertices as cubeModel } from "../models/cube.js";
import { vertices as waterModel } from "../models/water.js";

export const canvas = document.querySelector("canvas")!;
export const ctx = canvas.getContext("2d")!;

export const renderBuffer = new RenderBuffer;
export const reflectionTexture = new RenderBuffer;

export const playerCamera = new Camera(Math.PI/4);
export const reflectionCamera = new Camera(Math.PI/2.2);

export const cubeModelMatrix = new Float32Array(16);

export { rgbaShader as rgbShader, waterShader };
export { cubeModel, waterModel };

export const variables = {
	renderWater: true,
}


let p_resolution = 0;
export function configure(width: number, height: number, resolution: number, fontSize: number) {
	p_resolution = resolution;
	canvas.width = width*resolution;
	canvas.height = height*resolution;
	ctx.font = `${resolution * fontSize}px monospace`;

	renderBuffer.resize(width, height);
	reflectionTexture.resize(width, height);
}

export function renderFrame(frame: number, renderWater: boolean) {
	renderBuffer.clear();

	if (renderWater) {
		reflectionTexture.clear();

		// draw cube to reflection texture using the reflection camera
		rgbaShader.uniforms.transform = reflectionCamera.getTransform(cubeModelMatrix);
		reflectionTexture.drawTriangles(
			cubeModel,				// model
			rgbaShader.vertex,		// vertex shader
			rgbaShader.fragment,		// fragment shader
		);


		// draw water to render buffer using reflection texture
		waterShader.uniforms.transform = playerCamera.getTransform();
		waterShader.uniforms.reflectionTexture = reflectionTexture;
		waterShader.uniforms.distortionFrame = frame;
		renderBuffer.drawTriangles(
			waterModel,				// model
			waterShader.vertex,		// vertex shader
			waterShader.fragment,	// fragment shader
		);
	}

	// draw cube
	rgbaShader.uniforms.transform = playerCamera.getTransform(cubeModelMatrix);
	renderBuffer.drawTriangles(
		cubeModel,				// model
		rgbaShader.vertex,		// vertex shader
		rgbaShader.fragment,		// fragment shader
	);

	// use canvas to display render buffer
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderBuffer.renderToCanvas(ctx, p_resolution);
}