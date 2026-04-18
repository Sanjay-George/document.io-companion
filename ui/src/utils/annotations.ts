import { ANNOTATED_ELEMENT_CLASS, ANNOTATED_ELEMENT_ICON_CLASS, ANNOTATED_ELEMENT_WITH_SHADOW_CLASS, EDIT_ANNOTATED_CLASS, EDIT_ANNOTATED_ICON_CLASS } from "./constants";

const VIEW_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z" clip-rule="evenodd" />
</svg>
`;

const PENCIL_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343z" />
</svg>
`;

/**
 * Shared helper — appends a small icon badge to an element.
 */
function addIcon(
    element: HTMLElement,
    svgString: string,
    cssClass: string,
    callback: Function | null,
) {
    if (element.querySelector(`.${cssClass}`)) return;

    const elementStyle = window.getComputedStyle(element);
    const icon = document.createElement('div');
    icon.innerHTML = svgString;
    icon.classList.add(cssClass);
    icon.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        callback && callback();
    };
    icon.style.height = `min(20px, ${element.offsetHeight - 5}px)`;
    icon.style.width = `min(20px, ${element.offsetHeight - 5}px)`;
    icon.style.minHeight = `15px`;
    icon.style.minWidth = `15px`;
    icon.style.zIndex = (getMaxZIndexOfChildren(element) + 1).toString();

    element.appendChild(icon);
    if (!elementStyle.position.length || elementStyle.position === 'static') {
        element.style.position = 'relative';
    }
}

/**
 * Removes any direct-child icon with the given CSS class from the element.
 */
function removeIconByClass(element: HTMLElement, cssClass: string) {
    for (const child of Array.from(element.children)) {
        if (child.classList.contains(cssClass)) {
            element.removeChild(child);
            return;
        }
    }
}

/**
 * Highlights an annotated element in blue (view mode).
 * Adds a view icon badge that triggers iconCallback on click.
 */
export function highlight(element: HTMLElement, showIcon = true, iconCallback: Function | null = null, withShadow = false) {
    if (!element || !isHighlightable(element) || isAnnotated(element) || isEditAnnotated(element)) {
        return;
    }
    element.classList.add(ANNOTATED_ELEMENT_CLASS);
    withShadow && element.classList.add(ANNOTATED_ELEMENT_WITH_SHADOW_CLASS);
    showIcon && addIcon(element, VIEW_ICON, ANNOTATED_ELEMENT_ICON_CLASS, iconCallback);
}

/**
 * Highlights an annotated element in amber (edit mode).
 * Adds a pencil icon badge that triggers iconCallback on click.
 */
export function highlightEditMode(element: HTMLElement, iconCallback: Function | null = null) {
    if (!element || !isHighlightable(element) || isAnnotated(element) || isEditAnnotated(element)) {
        return;
    }
    element.classList.add(EDIT_ANNOTATED_CLASS);
    addIcon(element, PENCIL_ICON, EDIT_ANNOTATED_ICON_CLASS, iconCallback);
}

/**
 * Removes all highlight classes and icon badges from the element.
 * Handles both view-mode (blue) and edit-mode (amber) highlights.
 */
export function removeHighlight(element: HTMLElement) {
    if (!element) return;
    if (isAnnotated(element)) {
        element.classList.remove(ANNOTATED_ELEMENT_CLASS);
        element.classList.remove(ANNOTATED_ELEMENT_WITH_SHADOW_CLASS);
        removeIconByClass(element, ANNOTATED_ELEMENT_ICON_CLASS);
    }
    if (isEditAnnotated(element)) {
        element.classList.remove(EDIT_ANNOTATED_CLASS);
        removeIconByClass(element, EDIT_ANNOTATED_ICON_CLASS);
    }
}

function getMaxZIndexOfChildren(element: HTMLElement): number {
    const children = element.children;
    let maxZIndex = 0;
    for (let i = 0; i < children.length; i++) {
        const zIndex = window.getComputedStyle(children[i]).zIndex;
        if (zIndex && zIndex !== 'auto') {
            maxZIndex = Math.max(maxZIndex, parseInt(zIndex));
        }
    }
    return maxZIndex;
}

function isAnnotated(element: HTMLElement): boolean {
    return element.classList.contains(ANNOTATED_ELEMENT_CLASS);
}

function isEditAnnotated(element: HTMLElement): boolean {
    return element.classList.contains(EDIT_ANNOTATED_CLASS);
}

export function isHighlightable(element: HTMLElement) {
    const blockedElements = new Set([
        'svg', 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon',
        'script', 'style', 'link', 'meta', 'head', 'title', 'base', 'noscript',
        'iframe', 'object', 'embed', 'param', 'source', 'track', 'canvas', 'map',
        'area', 'audio', 'video', 'picture', 'portal', 'template', 'slot', 'img'
    ]);
    return !blockedElements.has(element.tagName.toLowerCase());
}

