/**
 * Water Demo
 * ======================================================
 * @module main
 * @author Cymaera
 */

// import dependencies
import * as ascii3D from "../../src/ascii-3d-v2.js";
import * as ui from "./ui.js";
import { Camera, tickly } from "./utilities.js";

// shaders
// >> contains the vertex shader, fragment shader, and an object for setting uniforms.
import * as rgbShader from "./shaders/rgb.js";
import * as waterShader from "./shaders/water.js";

// models
// >> normally, they are stored as json files, but I'm using js modules for convenience.
import * as cubeModel from "./models/cube.js";
import * as floorModel from "./models/water.js";

// CONFIG
// set using url params
const urlParams = new URLSearchParams(location.search);

// canvas dimensions (in character-cells)
const width	 = parseInt(urlParams.get("width")) || 50;
const height = parseInt(urlParams.get("height")) || 50;

// resolution: number of pixels per character-cells
// font size: character size as a fraction of the resolution
const resolution = parseInt(urlParams.get("resolution")) || 16;
const fontSize 	 = parseFloat(urlParams.get("font-size")) || 1.2;

// a boolean indicating if water should be rendered.
const renderWater = urlParams.get("no-water") === null;

// get canvas element and set dimensions
const myCanvas = document.querySelector("canvas");
myCanvas.width = width*resolution;
myCanvas.height = height*resolution;

// get rendering context from canvas and set font size
const ctx = myCanvas.getContext("2d");
ctx.font = `${resolution * fontSize}px monospace`;

// Create a render buffer and reflection texture.
// >> renderBuffer is displayed to the canvas.
// >> reflectionTexture is used to render the water.
const renderBuffer = new ascii3D.RenderBuffer(width,height);
const reflectionTexture = new ascii3D.RenderBuffer(width,height);

// Create player camera & reflection camera
// >> the player camera is controlled by the UI module
// >> the reflection camera always looks up at the cube from the water surface
const playerCamera = new Camera(Math.PI/4);
const reflectionCamera = new Camera(Math.PI/2.2);
reflectionCamera.lookAt(
	[0,-5,0],	// camera position (at water surface)
	[0,0,0],	// cube position
	[0,0,-1],	// up vector
);

// Cube model matrix
// >> this is used to rotate the cube. (controlled by the UI module)
const cubeModelMatrix = new Array(16);

// Let UI module control the player camera and cube model matrix.
ui.attachCamera(playerCamera);
ui.attachModelMatrix(cubeModelMatrix);

// Render scene every frame
tickly(function(deltaTime) {
	// clear render buffers
	reflectionTexture.clear();
	renderBuffer.clear();

	if (renderWater) {
		// draw cube to reflection texture using the reflection camera
		rgbShader.uniforms.transform = reflectionCamera.getTransform(cubeModelMatrix);
		reflectionTexture.drawTrianglesByIndex(
			rgbShader.vertex,		// vertex shader
			rgbShader.fragment,		// fragment shader
			cubeModel.vertices,		// vertex buffer
			cubeModel.vertexSpan,	// vertex span
			cubeModel.indices		// index buffer
		);

		// draw water to render buffer using reflection texture
		waterShader.uniforms.transform = playerCamera.getTransform();
		waterShader.uniforms.distortionFrame += deltaTime;
		waterShader.uniforms.reflectionTexture = reflectionTexture;
		renderBuffer.drawTrianglesByIndex(
			waterShader.vertex,		// vertex shader
			waterShader.fragment,	// fragment shader
			floorModel.vertices,	// vertex buffer
			floorModel.vertexSpan,	// vertex span
			floorModel.indices		// index buffer
		);
	}

	// draw cube
	rgbShader.uniforms.transform = playerCamera.getTransform(cubeModelMatrix);
	renderBuffer.drawTrianglesByIndex(
		rgbShader.vertex,		// vertex shader
		rgbShader.fragment,		// fragment shader
		cubeModel.vertices,		// vertex buffer
		cubeModel.vertexSpan,	// vertex span
		cubeModel.indices		// index buffer
	);

	// use canvas to display render buffer
	ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
	ascii3D.renderToCanvas(ctx,renderBuffer,resolution);
});
