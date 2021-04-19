import { FragmentShader, RenderBuffer, VertexShader } from "../../ascii3d.js";
export interface Uniforms {
    transform: mat4;
    reflectionTexture: RenderBuffer;
    distortionFrame: number;
    distortionMagnitude: number;
    distortionRate: number;
    distortionPeriods: number;
    tint: [number, number, number, number];
    reflectionChar: number;
    waterChar: number;
}
export declare const uniforms: Uniforms;
export declare type WaterVertex = [number, number, number, number, number];
export declare type WaterFragment = [number, number];
export declare const vertex: VertexShader<WaterVertex, WaterFragment>;
export declare const fragment: FragmentShader<WaterFragment>;
