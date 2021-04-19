import { VertexShader, FragmentShader } from "../../ascii3d.js";
export interface Uniforms {
    transform: mat4;
}
export declare const uniforms: Uniforms;
export declare type RGBAVertex = [number, number, number, number, number, number, number];
export declare type RGBAFragment = [number, number, number, number, number];
export declare const vertex: VertexShader<RGBAVertex, RGBAFragment>;
export declare const fragment: FragmentShader<RGBAFragment>;
