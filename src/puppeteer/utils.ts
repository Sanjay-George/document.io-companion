import { ANNOTATED_ELEMENT_CLASS, ANNOTATED_ELEMENT_ICON_CLASS, HOVERED_ELEMENT_CLASS } from "./editor";

const view_icon_svg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`;


async function highlightAnnotatedElements(annotations: []) {
    for (let annotation of annotations) {
        const { _id: id, target }: { _id: string, target: string } = annotation;
        const element = document.querySelector(target) as HTMLElement;

        if (element && !isAnnotated(element)) {
            element.classList.add(ANNOTATED_ELEMENT_CLASS);
            element.dataset.annotationId = id;
            const elementStyle = window.getComputedStyle(element);

            // Add view icon
            const icon = document.createElement('div');
            icon.innerHTML = view_icon_svg;
            icon.classList.add(ANNOTATED_ELEMENT_ICON_CLASS);
            icon.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Open in editor
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
    }
}

/**
 * Gets the maximum z-index of the children of the element
 * @param element 
 * @returns
 */
function getMaxZIndexOfChildren(element): number {
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
function isAnnotated(element): boolean {
    return element.classList.contains(ANNOTATED_ELEMENT_CLASS) && hasViewIcon(element);
}


/**
 * Checks if the element has the view icon
 * @param element 
 * @returns 
 */
function hasViewIcon(element) {
    if (!element.children || element.children.length === 0) {
        return false;
    }
    const lastChild = element.children[element.children.length - 1];
    return lastChild.tagName.toLowerCase() === 'div'
        && lastChild.classList.contains(ANNOTATED_ELEMENT_ICON_CLASS);

}

/**
 * Function to get the query selector of an element
 * @param element 
 * @returns 
 */
function getQuerySelector(element: HTMLElement): string {
    if (!(element instanceof Element)) {
        throw new Error('The provided input is not a DOM element');
    }
    function getPathTo(element) {
        if (element.id) {
            return `#${CSS.escape(element.id)}`;
        }

        if (element === document.body) {
            return 'body';
        }

        let path = [] as string[];
        while (element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase() as string;
            if (element.className && typeof element.className === 'string') {
                const classSelector = `${(Array.from(element.classList) as string[])
                    .filter(i => i.trim().length > 0)
                    .filter(i => i !== HOVERED_ELEMENT_CLASS)
                    .map(i => CSS.escape(i))
                    .join('.')}`;
                classSelector.length > 0 && (selector += `.${classSelector}`);
            }
            if (element !== document.documentElement) {
                let sibling = element;
                let nth = 1;
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.nodeName.toLowerCase() === selector.split('.')[0]) {
                        nth++;
                    }
                }
                selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            element = element.parentNode;

            if (document.querySelectorAll(path.join(' > ')).length === 1) {
                break;
            }
        }
        return path.join(' > ');
    }
    return getPathTo(element);
}



/**
 * Debounce function 
 * @param func Function to be debounced
 * @param wait Time to wait before calling the function
 * @param immediate If true, the function will be called immediately
 * @returns
 */
function debounce(func: Function, wait: number, immediate: boolean) {
    let timeout;
    return function () {
        // @ts-ignore
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function getCurrentPageUrl() {
    return window.location.origin + window.location.pathname;
}   