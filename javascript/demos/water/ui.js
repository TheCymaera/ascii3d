import * as scene from "./scene.js";
import { mat4 } from "../gl-matrix/index.js";
export const cameraAngleX = document.querySelector("#cameraAngleXInput");
export const cameraAngleY = document.querySelector("#cameraAngleYInput");
export const cameraDistance = document.querySelector("#cameraDistanceInput");
export const rotateCube = document.querySelector("#rotateCubeInput");
export const cubeRotation = {
    cubeAngleX: 0,
    cubeAngleY: 0,
    cubeRotateX: 1,
    cubeRotateY: 2,
};
export const renderWater = document.querySelector("#renderWaterInput");
export function updateCube() {
    mat4.identity(scene.cubeModelMatrix);
    mat4.rotateX(scene.cubeModelMatrix, scene.cubeModelMatrix, cubeRotation.cubeAngleX);
    mat4.rotateY(scene.cubeModelMatrix, scene.cubeModelMatrix, cubeRotation.cubeAngleY);
}
export function updatePlayerCamera() {
    scene.playerCamera.lookAround([0, 0, 0], cameraDistance.valueAsNumber, cameraAngleX.valueAsNumber * Math.PI / 180, cameraAngleY.valueAsNumber * Math.PI / 180, [0, 1, 0]);
}
export function update(deltaTime) {
    if (rotateCube.checked) {
        cubeRotation.cubeAngleX += cubeRotation.cubeRotateX * deltaTime / 1000;
        cubeRotation.cubeAngleY += cubeRotation.cubeRotateY * deltaTime / 1000;
        updateCube();
    }
    scene.renderFrame(performance.now(), renderWater.checked);
}
updateCube();
updatePlayerCamera();
cameraAngleX.addEventListener("input", updatePlayerCamera);
cameraAngleY.addEventListener("input", updatePlayerCamera);
cameraDistance.addEventListener("input", updatePlayerCamera);
//# sourceMappingURL=ui.js.map