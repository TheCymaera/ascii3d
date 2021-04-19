export declare function tickly(callback: (delta: number) => any): void;
export declare class Camera {
    readonly foxy: number;
    readonly view: mat4;
    readonly projection: mat4;
    constructor(foxy: number);
    getTransform(model?: mat4): mat4;
    lookAt(position: vec3, target: vec3, up: vec3): void;
    lookAround(target: vec3, distance: number, angleX: number, angleY: number, up: vec3): void;
}
export declare type Color = [number, number, number, number];
export declare function mixColors(base: Color, add: Color): Color;
