import { ANNOTATED_ELEMENT_CLASS, ANNOTATED_ELEMENT_ICON_CLASS, ANNOTATED_ELEMENT_WITH_SHADOW_CLASS } from "./constants";

const VIEW_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z" clip-rule="evenodd" />
</svg>
`;


/**
 * Highlights the annotated element
 * Adds a view icon to the element to view the annotation
 * @param element Element to highlight
 * @param showIcon If true, shows an icon to view the annotation
 * @param iconCallback Callback function to call when the icon is clicked
 * @param withShadow If true, adds a shadow to the element
 */
export function highlight(element: HTMLElement, showIcon = true, iconCallback: Function | null = null, withShadow = false) {
    if (!element || !isHighlightable(element) || isAnnotated(element)) {
        return;
    }
    // const { _id: id, target }: { _id: string, target: string } = annotation;
    // const element = document.querySelector(target) as HTMLElement;

    element.classList.add(ANNOTATED_ELEMENT_CLASS);
    withShadow && element.classList.add(ANNOTATED_ELEMENT_WITH_SHADOW_CLASS);
    // TODO: Add annotation id to the element only if needed
    // element.dataset.annotationId = id;

    showIcon && addViewIcon(element, iconCallback);
}

/**
 * Adds the view icon to the element
 * @param element Element to add the icon to
 * @param callback Callback function to call when the icon is clicked
 * @returns 
 */
function addViewIcon(element: HTMLElement, callback: Function | null = null) {
    const elementStyle = window.getComputedStyle(element);

    if (hasViewIcon(element)) {
        return;
    }

    // Add view icon
    const icon = document.createElement('div');
    icon.innerHTML = VIEW_ICON;
    icon.classList.add(ANNOTATED_ELEMENT_ICON_CLASS);
    icon.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        callback && callback();
    };
    // Assign height and width based on element size
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

export function removeHighlight(element: HTMLElement) {
    if (!element || !isAnnotated(element)) {
        return;
    }
    element.classList.remove(ANNOTATED_ELEMENT_CLASS);
    element.classList.remove(ANNOTATED_ELEMENT_WITH_SHADOW_CLASS);
    removeViewIcon(element);
}


function removeViewIcon(element: HTMLElement) {
    if (!hasViewIcon(element)) {
        return;
    }
    const icon = element.querySelector(`.${ANNOTATED_ELEMENT_ICON_CLASS}`);
    if (icon && icon.parentNode === element) {
        element.removeChild(icon);
    }
}

/**
 * Gets the maximum z-index of the children of the element
 * @param element 
 * @returns
 */
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

/**
 * Checks if the element is already annotated
 * @param element 
 * @returns 
 */
function isAnnotated(element: HTMLElement): boolean {
    return element.classList.contains(ANNOTATED_ELEMENT_CLASS) && hasViewIcon(element);
}


/**
 * Checks if the element has the view icon
 * @param element 
 * @returns 
 */
function hasViewIcon(element: HTMLElement) {
    if (!element.children || element.children.length === 0) {
        return false;
    }
    const lastChild = element.children[element.children.length - 1];
    return lastChild.tagName.toLowerCase() === 'div'
        && lastChild.classList.contains(ANNOTATED_ELEMENT_ICON_CLASS);
}

export function isHighlightable(element: HTMLElement) {
    // disallow svg elements
    const blockedElements = new Set([
        'svg', 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon',
        'script', 'style', 'link', 'meta', 'head', 'title', 'base', 'noscript',
        'iframe', 'object', 'embed', 'param', 'source', 'track', 'canvas', 'map',
        'area', 'audio', 'video', 'picture', 'portal', 'template', 'slot', 'img'
    ]);
    return !blockedElements.has(element.tagName.toLowerCase());
}
