import { mat4 } from "./gl-matrix/index.js";
export function tickly(callback) {
    let oldTime = performance.now();
    async function tickly() {
        const newTime = performance.now();
        const delta = newTime - oldTime;
        oldTime = newTime;
        callback(delta);
        requestAnimationFrame(tickly);
    }
    requestAnimationFrame(tickly);
}
export class Camera {
    constructor(foxy) {
        this.view = new Float32Array(16);
        this.projection = new Float32Array(16);
        mat4.perspective(this.projection, foxy, 1, 0.1, 1000.0);
    }
    getTransform(model) {
        const out = new Float32Array(16);
        mat4.mul(out, this.projection, this.view);
        if (model)
            mat4.mul(out, out, model);
        return out;
    }
    lookAt(position, target, up) {
        mat4.lookAt(this.view, position, target, up);
    }
    lookAround(target, distance, angleX, angleY, up) {
        const camX = target[0] - distance;
        const camXSafe = camX === 1 ? 1.01 : camX;
        const cameraPos = [camXSafe, target[1], target[2]];
        mat4.lookAt(this.view, cameraPos, target, up);
        mat4.rotateZ(this.view, this.view, angleY);
        mat4.rotateY(this.view, this.view, angleX);
    }
}
export function mixColors(base, add) {
    const A = 1 - (1 - add[3]) * (1 - base[3]);
    const R = add[0] * add[3] / A + base[0] * base[3] * (1 - add[3]) / A;
    const G = add[1] * add[3] / A + base[1] * base[3] * (1 - add[3]) / A;
    const B = add[2] * add[3] / A + base[2] * base[3] * (1 - add[3]) / A;
    return [R, G, B, A];
}
//# sourceMappingURL=utilities.js.map