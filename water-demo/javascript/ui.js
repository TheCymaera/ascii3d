/**
 * Controls
 * ======================================================
 * @module ui
 * @author Cymaera
 */
import { tickly } from "./utilities.js";
import { mat4 } from "./gl-matrix/index.js";

/**
 * Attach camera
 * @param {import("./utilities").Camera} camera 
 */
export function attachCamera(camera) {
	// Camera settings
	let angleX = 0;
	let angleY = 0;
	let distance = 12;

	// HTML Inputs
	const [angleXInput,angleYInput,distanceInput] = document.getElementById("cameraControls").querySelectorAll("input");
	angleXInput.oninput		= ()=>{angleX = parseFloat(angleXInput.value) * Math.PI / 180};
	angleYInput.oninput		= ()=>{angleY = parseFloat(angleYInput.value) * Math.PI / 180};
	distanceInput.oninput	= ()=>{distance = parseFloat(distanceInput.value)};
	angleXInput.value	= (angleX / Math.PI * 180).toString();
	angleYInput.value	= (angleY / Math.PI * 180).toString();
	distanceInput.value	= (distance).toString();

	// Keyboard
	const pressedKeys = new Set;
	window.addEventListener("keydown",(event)=>{
		if (event.repeat) return;
		pressedKeys.add(event.code);
	});
	window.addEventListener("keyup",(event)=>{
		if (event.repeat) return;
		pressedKeys.delete(event.code);
	});


	// Update camera rotation every frame
	const PI = Math.PI, CIRCLE = PI*2;
	tickly(function(deltaTime) {
		// change angle
		const angleChange = deltaTime / 1000 * CIRCLE * 0.5;
		if (pressedKeys.has("KeyA")) {
			angleX += angleChange;
			angleX = (angleX + CIRCLE) % CIRCLE;
			angleXInput.value = (angleX / PI * 180).toString();
		}
		if (pressedKeys.has("KeyD")) {
			angleX -= angleChange;
			angleX = (angleX + CIRCLE) % CIRCLE;
			angleXInput.value = (angleX / PI * 180).toString();
		}
		if (pressedKeys.has("KeyS")) {
			angleY += angleChange;
			angleY = (angleY + CIRCLE) % CIRCLE;
			angleYInput.value = (angleY / PI * 180).toString();
		}
		if (pressedKeys.has("KeyW")) {
			angleY -= angleChange;
			angleY = (angleY + CIRCLE) % CIRCLE;
			angleYInput.value = (angleY / PI * 180).toString();
		}

		// change distance
		const distanceChange = deltaTime / 1000 * 10;
		if (pressedKeys.has("KeyQ")) {
			distance -= distanceChange;
			distanceInput.value = distance.toString();
		}
		if (pressedKeys.has("KeyE")) {
			distance += distanceChange;
			distanceInput.value = distance.toString();
		}

		// update camera
		camera.lookAround(
			[0,0,0],	// target (center of cube)
			distance,	// distance to cube
			angleX,		// angle X of camera
			angleY,		// angle Y of camera
			[0,1,0]		// up-vector
		);
	});
}

/**
 * Attach model matrix
 * @param {mat4} model 
 */
export function attachModelMatrix(model) {
	mat4.identity(model);

	// Settings
	let rotate = true;

	// HTML Inputs
	const [doRotateInput] = document.getElementById("modelControls").querySelectorAll("input");
	doRotateInput.onchange = ()=>{rotate = doRotateInput.checked};
	doRotateInput.checked = rotate;

	// Keyboard
	window.addEventListener("keydown",(event)=>{
		if (event.repeat) return;
		if (event.code === "KeyR") doRotateInput.checked = rotate = !rotate;
	});

	// Update model every frame
	tickly(function(deltaTime) {
		// rotate
		if (rotate) {
			mat4.rotateX(model,model,deltaTime/1000);
			mat4.rotateY(model,model,deltaTime/2000);
		}
	});
}



{
	// settings
	let controlsMenuOpen = true, infoDialogOpen = false;

	// HTML root
	const root = document.documentElement;
	root.setAttribute("data-controls-menu-open",controlsMenuOpen.toString());
	root.setAttribute("data-info-dialog-open",infoDialogOpen.toString());
	
	// Buttons
	const [infoDialogToggle,downloadButton,menuToggle] = document.getElementById("buttons").querySelectorAll("li");
	infoDialogToggle.onclick = ()=>{
		root.setAttribute("data-info-dialog-open",(infoDialogOpen = !infoDialogOpen).toString());
	};
	const canvas = document.querySelector("canvas");
	downloadButton.onclick = ()=>{
		const a = document.createElement("a");
		a.href = canvas.toDataURL("image/png");
		a.download = "ascii-3d-water.png";
		a.click();
	};
	menuToggle.onclick = ()=>{
		root.setAttribute("data-controls-menu-open",(controlsMenuOpen = !controlsMenuOpen).toString());
	};

	// Keyboard
	window.addEventListener("keydown",(event)=>{
		if (event.repeat) return;
		if (event.code === "KeyT") {
			root.setAttribute("data-controls-menu-open",(controlsMenuOpen = !controlsMenuOpen).toString());
		} else if (event.code === "KeyI") {
			root.setAttribute("data-info-dialog-open",(infoDialogOpen = !infoDialogOpen).toString());
		}
	});	
}