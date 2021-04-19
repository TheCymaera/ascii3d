import * as ui from "./ui.js";

export const keys = {
	incCameraAngleX: "KeyA",
	decCameraAngleX: "KeyD",
	incCameraAngleY: "KeyW",
	decCameraAngleY: "KeyS",
	incCameraDistance: "KeyQ",
	decCameraDistance: "KeyE",
	toggleCubeRotation: "KeyR",
};

export const movementSpeed = {
	angleX: 200,
	angleY: 200,
	distance: 50,
}

const pressedKeys: Set<string> = new Set;
window.addEventListener("keydown",(event)=>{
	if (event.repeat) return;
	if (event.code === keys.toggleCubeRotation) ui.rotateCube.checked = !ui.rotateCube.checked;
	pressedKeys.add(event.code);
});
window.addEventListener("keyup",(event)=>{
	if (event.repeat) return;
	pressedKeys.delete(event.code);
});

export function update(deltaTime: number) {
	const deltaAngleX 	= deltaTime / 1000 * movementSpeed.angleX;
	const deltaAngleY 	= deltaTime / 1000 * movementSpeed.angleY;
	const deltaDistance = deltaTime / 1000 * movementSpeed.distance;

	let cameraNeedsUpdate = false;
	if (pressedKeys.has(keys.incCameraAngleX)) {
		ui.cameraAngleX.valueAsNumber = (ui.cameraAngleX.valueAsNumber + deltaAngleX + 360) % 360;
		cameraNeedsUpdate = true;
	}
	if (pressedKeys.has(keys.decCameraAngleX)) {
		ui.cameraAngleX.valueAsNumber = (ui.cameraAngleX.valueAsNumber - deltaAngleX + 360) % 360;
		cameraNeedsUpdate = true;
	}
	if (pressedKeys.has(keys.incCameraAngleY)) {
		ui.cameraAngleY.valueAsNumber += deltaAngleY;
		cameraNeedsUpdate = true;
	}
	if (pressedKeys.has(keys.decCameraAngleY)) {
		ui.cameraAngleY.valueAsNumber -= deltaAngleY;
		cameraNeedsUpdate = true;
	}
	
	if (pressedKeys.has(keys.incCameraDistance)) {
		ui.cameraDistance.valueAsNumber += deltaDistance;
		cameraNeedsUpdate = true;
	}
	if (pressedKeys.has(keys.decCameraDistance)) {
		ui.cameraDistance.valueAsNumber -= deltaDistance;
		cameraNeedsUpdate = true;
	}

	if (cameraNeedsUpdate) {
		ui.updatePlayerCamera();
	}
}