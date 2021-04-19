export const canvas = document.querySelector("canvas");
export const downloadImageSettings = {
    name: "image.png",
    format: "image/png",
    quality: undefined
};
export const shareData = {
    title: document.title,
    text: document.head.querySelector(`meta[name="description"]`)?.content || document.title,
    url: location.href,
};
export function toggleInfoDialog(isOpen) {
    document.documentElement.toggleAttribute("data-open-info-dialog", isOpen);
}
export function downloadCanvasAsImage(settings = downloadImageSettings) {
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL(settings.format, settings.quality);
    anchor.download = settings.name;
    anchor.click();
}
export function toggleSettings(isOpen) {
    document.documentElement.toggleAttribute("data-open-settings", isOpen);
}
export async function share(data = shareData) {
    try {
        await navigator.share(data);
        return true;
    }
    catch (e) {
        alert(`Failed to share.`);
        return false;
    }
}
document.querySelector("#toggleInfoDialogButton")?.addEventListener("click", () => toggleInfoDialog());
document.querySelector("#downloadImageButton")?.addEventListener("click", () => downloadCanvasAsImage());
document.querySelector("#toggleSettingsButton")?.addEventListener("click", () => toggleSettings());
document.querySelector("#shareButton")?.addEventListener("click", () => share());
//# sourceMappingURL=canvasApp.js.map