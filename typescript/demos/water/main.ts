import { tickly } from "../utilities.js";
import * as canvasApp from "./canvasApp.js";
import * as scene from "./scene.js";
import * as ui from "./ui.js";
import * as keyboard from "./keyboard.js";
import * as ascii3d from "../../ascii3d.js";

console.log(`For debugging, see "window.app".`);
window["app"] = { canvasApp, scene, ui, keyboard, ascii3d };

const urlParams = new URLSearchParams(location.search);

canvasApp.downloadImageSettings.name = "ascii3d-water.png";

scene.configure(
	parseInt(urlParams.get("width")!) || 50,
	parseInt(urlParams.get("height")!) || 50,
	parseInt(urlParams.get("resolution")!) || 16,
	parseFloat(urlParams.get("font-size")!) || 1.2
);

scene.reflectionCamera.lookAt(
	[0,-5,0],	// camera position (at water surface)
	[0,0,0],	// cube position
	[0,0,-1],	// up vector
);

tickly(function(deltaTime) {
	keyboard.update(deltaTime);
	ui.update(deltaTime);
});