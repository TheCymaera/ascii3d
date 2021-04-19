import { mat4, vec4 } from "../gl-matrix/index.js";
export const uniforms = {
    transform: mat4.identity(mat4.create()),
};
export const vertex = ([x, y, z, r, g, b, charCode]) => {
    return {
        position: vec4.transformMat4(vec4.create(), [x, y, z, 1], uniforms.transform),
        fragment: [r, g, b, 1, charCode]
    };
};
export const fragment = (fragment) => {
    return fragment;
};
//# sourceMappingURL=rgba.js.map