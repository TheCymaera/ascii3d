import { RenderBuffer } from "../../ascii3d.js";
import { Camera } from "../utilities.js";
import * as rgbaShader from "../shaders/rgba.js";
import * as waterShader from "../shaders/water.js";
import { vertices as cubeModel } from "../models/cube.js";
import { vertices as waterModel } from "../models/water.js";
export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");
export const renderBuffer = new RenderBuffer;
export const reflectionTexture = new RenderBuffer;
export const playerCamera = new Camera(Math.PI / 4);
export const reflectionCamera = new Camera(Math.PI / 2.2);
export const cubeModelMatrix = new Float32Array(16);
export { rgbaShader as rgbShader, waterShader };
export { cubeModel, waterModel };
export const variables = {
    renderWater: true,
};
let p_resolution = 0;
export function configure(width, height, resolution, fontSize) {
    p_resolution = resolution;
    canvas.width = width * resolution;
    canvas.height = height * resolution;
    ctx.font = `${resolution * fontSize}px monospace`;
    renderBuffer.resize(width, height);
    reflectionTexture.resize(width, height);
}
export function renderFrame(frame, renderWater) {
    renderBuffer.clear();
    if (renderWater) {
        reflectionTexture.clear();
        rgbaShader.uniforms.transform = reflectionCamera.getTransform(cubeModelMatrix);
        reflectionTexture.drawTriangles(cubeModel, rgbaShader.vertex, rgbaShader.fragment);
        waterShader.uniforms.transform = playerCamera.getTransform();
        waterShader.uniforms.reflectionTexture = reflectionTexture;
        waterShader.uniforms.distortionFrame = frame;
        renderBuffer.drawTriangles(waterModel, waterShader.vertex, waterShader.fragment);
    }
    rgbaShader.uniforms.transform = playerCamera.getTransform(cubeModelMatrix);
    renderBuffer.drawTriangles(cubeModel, rgbaShader.vertex, rgbaShader.fragment);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBuffer.renderToCanvas(ctx, p_resolution);
}
//# sourceMappingURL=scene.js.map