import { MouseInputEvent } from "electron";

export const MODAL_ROOT_ID = 'document-io-root';
export const HOVERED_ELEMENT_CLASS = 'document-io-hovered-element';
export const ANNOTATED_ELEMENT_CLASS = 'document-io-annotated-element';
export const ANNOTATED_ELEMENT_ICON_CLASS = 'document-io-annotated-element-icon';

function addEventListeners() {
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    // document.addEventListener("mousedown", handleMouseDown);
    // document.addEventListener('contextmenu', handleContextMenuClick);
}

// TODO: Check if not required and remove
function removeEventListeners() {
    document.removeEventListener("mouseover", handleMouseOver);
    document.removeEventListener("mouseout", handleMouseOut);
    // document.removeEventListener("mousedown", handleMouseDown);
    // document.removeEventListener('contextmenu', handleContextMenuClick);
}

/**
 * Handle Mouse Over event
 * Highlights the element on mouse over, if not already annotated
 * @param {*} event 
 * @returns 
 */
const handleMouseOver = (event: MouseEvent) => {
    // TODO: Modal elements should not be highlighted. Add Context menu check later.
    // if (isModalOpen || isContextMenuOpen) {
    //     return;
    // }
    const target = event.target as HTMLElement;
    if (target.classList.contains(ANNOTATED_ELEMENT_CLASS)
        || target.classList.contains(ANNOTATED_ELEMENT_ICON_CLASS)) {
        return;
    }
    target.classList.add(HOVERED_ELEMENT_CLASS);
};

/**
 * Handle Mouse Out event
 * Removes the highlight from the element on mouse out
 * @param event 
 * @returns 
 */
const handleMouseOut = (event: MouseEvent) => {
    // TODO: Modal elements should not be highlighted. Add Context menu check later.
    // if (isModalOpen || isContextMenuOpen) {
    //     return;
    // }
    (event.target as HTMLElement).classList.remove(HOVERED_ELEMENT_CLASS);
}

// TODO: Add this once context menu is implemented
// const handleMouseDown = (event) => {
//     // set context menu open to false if the user clicks outside the context menu
//     if (isContextMenuOpen) {
//         isContextMenuOpen = false;
//         return selectedElement?.classList?.remove(HOVERD_ELEMENT_CLASS);
//     }
//     if (isModalOpen) {
//         return;
//     }
// };

// const handleContextMenuClick = (event) => {
//     isContextMenuOpen = true;
//     selectedElement = event.target;

//     console.log('User selected element:', selectedElement);
//     const qs = getQuerySelector(selectedElement);
//     console.log('Query selector:', qs);
//     console.log('Element recorded:', document.querySelector(qs));
// };
