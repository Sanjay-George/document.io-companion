import { ANNOTATED_ELEMENT_CLASS, EDIT_ANNOTATED_CLASS, HOVERED_ELEMENT_CLASS, MODAL_ROOT_ID } from "@/utils/constants";
import { useContext, useEffect, useState } from "react";
import { PanelOrientationContext } from "@/App";
import { getQuerySelector } from "@/utils";
import {
    Menu,
    Item,
    Separator,
    useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

export const CONTEXT_MENU_ID = "document-io-context-menu";

export default function ContextMenu({ onContextMenuOpen, onContextMenuClose }: { onContextMenuOpen: () => void, onContextMenuClose: () => void }) {

    const { show } = useContextMenu({
        id: CONTEXT_MENU_ID
    });
    const { editMode, setActivePopup } = useContext(PanelOrientationContext) as any;
    const [isVisible, setIsVisible] = useState(false);
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [targetIsAnnotated, setTargetIsAnnotated] = useState(false);

    useEffect(() => {
        document.addEventListener("contextmenu", displayMenu);
        return () => {
            document.removeEventListener("contextmenu", displayMenu);
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            onContextMenuOpen();
        } else {
            setTarget(null);
            onContextMenuClose();
        }
    }, [isVisible]);

    useEffect(() => {
        if (target) {
            target.classList.add(HOVERED_ELEMENT_CLASS);
        }
        return () => {
            if (target) {
                target.classList.remove(HOVERED_ELEMENT_CLASS);
            }
        }
    }, [target]);

    function displayMenu(e: MouseEvent) {
        if ((e.target as HTMLElement)?.closest(`#${MODAL_ROOT_ID}`)) {
            return;
        }
        e.preventDefault();
        const el = e.target as HTMLElement;
        const isAnnotated = el.classList.contains(ANNOTATED_ELEMENT_CLASS)
            || el.classList.contains(EDIT_ANNOTATED_CLASS);
        setTarget(el);
        setTargetIsAnnotated(isAnnotated);
        show({ event: e });
    }

    function handleAnnotateClick({ triggerEvent }: any) {
        const el = triggerEvent?.target as HTMLElement;
        setActivePopup({ type: 'add', target: getQuerySelector(el), elementRect: el.getBoundingClientRect() });
    }

    function handleEditClick({ triggerEvent }: any) {
        const el = triggerEvent?.target as HTMLElement;
        setActivePopup({ type: 'edit', target: getQuerySelector(el), elementRect: el.getBoundingClientRect() });
    }

    function handleViewClick({ triggerEvent }: any) {
        const el = triggerEvent?.target as HTMLElement;
        setActivePopup({ type: 'view', target: getQuerySelector(el), elementRect: el.getBoundingClientRect() });
    }

    return (
        <Menu id={CONTEXT_MENU_ID} onVisibilityChange={setIsVisible} className="text-sm">
            <Item disabled className="font-bold">DOCUMENT.IO</Item>
            <Separator />
            {editMode && !targetIsAnnotated && (
                <Item id="annotate" onClick={handleAnnotateClick}>
                    <span className="pr-4">✍️</span> Annotate
                </Item>
            )}
            {editMode && targetIsAnnotated && (
                <Item id="edit-annotation" onClick={handleEditClick}>
                    <span className="pr-4">✏️</span> Edit annotation
                </Item>
            )}
            {!editMode && targetIsAnnotated && (
                <Item id="view-annotation" onClick={handleViewClick}>
                    <span className="pr-4">👁️</span> View annotation
                </Item>
            )}
            {!editMode && !targetIsAnnotated && (
                <Item disabled>
                    <span className="text-slate-400 text-xs">No annotation here</span>
                </Item>
            )}
        </Menu>
    );
}