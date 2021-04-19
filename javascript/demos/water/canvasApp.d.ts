export declare const canvas: HTMLCanvasElement;
export declare const downloadImageSettings: {
    name: string;
    format: string;
    quality: undefined;
};
export declare const shareData: {
    title: string;
    text: string;
    url: string;
};
export declare function toggleInfoDialog(isOpen?: boolean): void;
export declare function downloadCanvasAsImage(settings?: {
    name: string;
    format: string;
    quality: undefined;
}): void;
export declare function toggleSettings(isOpen?: boolean): void;
export declare function share(data?: ShareData): Promise<boolean>;
