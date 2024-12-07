import { ANNOTATED_ELEMENT_CLASS, ANNOTATED_ELEMENT_ICON_CLASS } from "./constants";

const VIEW_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`;

/**
 * Highlights the annotated element
 * Adds a view icon to the element to view the annotation
 * @param element 
 */
export function highlight(element: HTMLElement, showTooltip = true) {
    if (!element || isAnnotated(element)) {
        return;
    }
    // const { _id: id, target }: { _id: string, target: string } = annotation;
    // const element = document.querySelector(target) as HTMLElement;

    element.classList.add(ANNOTATED_ELEMENT_CLASS);
    // TODO: Add annotation id to the element only if needed
    // element.dataset.annotationId = id;

    showTooltip && addViewIcon(element);
}

/**
 * Adds the view icon to the element
 * @param element 
 * @returns 
 */
function addViewIcon(element: HTMLElement) {
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
        // TODO: Open in editor
        // TODO: check how to use react router here.
        // openInEditor(getQuerySelector(element), id);
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
    removeViewIcon(element);
}


function removeViewIcon(element: HTMLElement) {
    if (!hasViewIcon(element)) {
        return;
    }
    const icon = element.querySelector(`.${ANNOTATED_ELEMENT_ICON_CLASS}`);
    if (icon) {
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