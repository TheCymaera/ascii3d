import { RenderBuffer } from "../../ascii3d.js";
import * as cube from "../models/cube.js";
import * as rgbaShader from "../shaders/rgba.js";
import { mat4 } from "../gl-matrix/index.js";
import * as utilities from "../utilities.js";
const width = 50, height = 50, fontSize = 32, letterSpacing = fontSize * 0.8;
const myCanvas = document.querySelector("canvas");
myCanvas.width = width * letterSpacing;
myCanvas.height = height * letterSpacing;
const ctx = myCanvas.getContext("2d");
ctx.font = `${fontSize}px monospace`;
const renderBuffer = new RenderBuffer(width, height);
const model = mat4.create();
const view = mat4.lookAt(new Float32Array(16), [0, 0, -8], [0, 0, 0], [0, 1, 0]);
const projection = mat4.perspective(new Float32Array(16), Math.PI / 4, 1, 0.1, 1000.0);
function tickly() {
    const angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    mat4.identity(model);
    mat4.rotate(model, model, angle, [0, 1, 0]);
    mat4.rotate(model, model, angle / 4, [1, 0, 0]);
    mat4.mul(rgbaShader.uniforms.transform, projection, view);
    mat4.mul(rgbaShader.uniforms.transform, rgbaShader.uniforms.transform, model);
    renderBuffer.clear();
    renderBuffer.drawTriangles(cube.vertices, rgbaShader.vertex, rgbaShader.fragment, true);
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    renderBuffer.renderToCanvas(ctx, letterSpacing, 0, 0);
}
;
utilities.tickly(tickly);
//# sourceMappingURL=main.js.map