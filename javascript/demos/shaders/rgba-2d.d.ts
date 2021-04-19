import { FragmentShader, FragmentShaderOutput, VertexShader } from "../../ascii3d.js";
export declare type RGBAVertex = [number, number, number, number, number, number];
export declare type RGBAFragment = FragmentShaderOutput;
export declare const vertex: VertexShader<RGBAVertex, RGBAFragment>;
export declare const fragment: FragmentShader<RGBAFragment>;
