import { RenderBuffer } from "../../ascii3d.js";
import * as rgbShader from "../shaders/rgba-2d.js";
const width = 50, height = 50, fontSize = 32, letterSpacing = fontSize * 0.8;
const myCanvas = document.querySelector("canvas");
myCanvas.width = width * letterSpacing;
myCanvas.height = height * letterSpacing;
const ctx = myCanvas.getContext("2d");
ctx.font = `${fontSize}px monospace`;
const vertices = [
    [0.0, 0.5, 1.0, 1.0, 0.0, "A".charCodeAt(0)],
    [-.5, -.5, 0.7, 0.0, 1.0, "G".charCodeAt(0)],
    [0.5, -.5, 0.1, 1.0, 0.6, "Y".charCodeAt(0)]
];
const renderBuffer = new RenderBuffer(width, height);
renderBuffer.drawTriangles(vertices, rgbShader.vertex, rgbShader.fragment);
renderBuffer.renderToCanvas(ctx, letterSpacing, 0, 0);
//# sourceMappingURL=main.js.map