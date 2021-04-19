import * as scene from "./scene.js";
import { mat4 } from "../gl-matrix/index.js";

export const cameraAngleX = document.querySelector("#cameraAngleXInput") as HTMLInputElement;
export const cameraAngleY = document.querySelector("#cameraAngleYInput") as HTMLInputElement;
export const cameraDistance = document.querySelector("#cameraDistanceInput") as HTMLInputElement;

export const rotateCube = document.querySelector("#rotateCubeInput") as HTMLInputElement;
export const cubeRotation = {
	cubeAngleX: 0,
	cubeAngleY: 0,
	cubeRotateX: 1,
	cubeRotateY: 2,
}

export const renderWater = document.querySelector("#renderWaterInput") as HTMLInputElement;

export function updateCube() {
	mat4.identity(scene.cubeModelMatrix);
	mat4.rotateX(scene.cubeModelMatrix, scene.cubeModelMatrix, cubeRotation.cubeAngleX);
	mat4.rotateY(scene.cubeModelMatrix, scene.cubeModelMatrix, cubeRotation.cubeAngleY);
}

export function updatePlayerCamera() {
	scene.playerCamera.lookAround(
		[0,0,0],									// target (center of cube)
		cameraDistance.valueAsNumber,				// distance to cube
		cameraAngleX.valueAsNumber * Math.PI / 180,	// angle X of camera
		cameraAngleY.valueAsNumber * Math.PI / 180,	// angle Y of camera
		[0,1,0]										// up-vector
	);
}

export function update(deltaTime: number) {
	// rotate cube
	if (rotateCube.checked) {
		cubeRotation.cubeAngleX += cubeRotation.cubeRotateX * deltaTime / 1000;
		cubeRotation.cubeAngleY += cubeRotation.cubeRotateY * deltaTime / 1000;
		updateCube();
	}

	// render scene
	scene.renderFrame(performance.now(), renderWater.checked);
}


updateCube();
updatePlayerCamera();
cameraAngleX.addEventListener("input",updatePlayerCamera);
cameraAngleY.addEventListener("input",updatePlayerCamera);
cameraDistance.addEventListener("input",updatePlayerCamera);