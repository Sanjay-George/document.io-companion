import { addEventListenersToAllIframes, removeEventListenersFromAllIframes } from "@/utils";
import { HOVERED_ELEMENT_CLASS, MODAL_ROOT_ID } from "@/utils/constants";
import { useEffect, useState } from "react";
import {
    Menu,
    Item,
    Separator,
    useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

export const CONTEXT_MENU_ID = "document-io-context-menu";

export default function ContextMenu({ onContextMenuOpen, onContextMenuClose, onContextItemClick }: { onContextMenuOpen: () => void, onContextMenuClose: () => void, onContextItemClick: (e: any) => void }) {

    const { show } = useContextMenu({
        id: CONTEXT_MENU_ID
    });
    const [isVisible, setIsVisible] = useState(false);
    // target is the element on which the context menu is triggered
    const [target, setTarget] = useState<HTMLElement | null>(null);

    // Add event listener to show context menu
    useEffect(() => {
        document.addEventListener("contextmenu", displayMenu);
        addEventListenersToAllIframes("contextmenu", displayMenu as any);

        return () => {
            document.removeEventListener("contextmenu", displayMenu);
            removeEventListenersFromAllIframes("contextmenu", displayMenu as any);
        };
    }, []);

    // Handle context menu visibility
    useEffect(() => {
        if (isVisible) {
            onContextMenuOpen();
        } else {
            setTarget(null);
            onContextMenuClose();
        }
    }, [isVisible]);

    // Add or remove highlight on hovering target element
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

    // Display context menu
    function displayMenu(event: MouseEvent) {
        if ((event.target as HTMLElement)?.closest(`#${MODAL_ROOT_ID}`)) {
            return;
        }
        event.preventDefault();

        setTarget(event?.target as HTMLElement);
        console.log(event.target);
        show({
            event,
        });
    }

    // Track visibility of context menu
    const trackVisibility = (isVisible: boolean) => {
        setIsVisible(isVisible);
    }

    return (
        <>
            <Menu id={CONTEXT_MENU_ID} onVisibilityChange={trackVisibility} className="text-sm">
                <Item disabled className="font-bold">DOCUMENT.IO</Item>
                <Separator />
                <Item id="annotate" onClick={onContextItemClick as any}> <span className="pr-4">✍️</span> Annotate</Item>
            </Menu>
        </>
    );
}
