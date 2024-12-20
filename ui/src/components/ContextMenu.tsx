import { getQuerySelector } from "@/utils";
import { HOVERED_ELEMENT_CLASS, MODAL_ROOT_ID } from "@/utils/constants";
import { useEffect, useState } from "react";
import {
    Menu,
    Item,
    Separator,
    useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router";

export const CONTEXT_MENU_ID = "document-io-context-menu";

export default function ContextMenu({ onContextMenuOpen, onContextMenuClose }: { onContextMenuOpen: () => void, onContextMenuClose: () => void }) {

    const { show } = useContextMenu({
        id: CONTEXT_MENU_ID
    });
    const [isVisible, setIsVisible] = useState(false);
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    // Add event listener to show context menu
    useEffect(() => {
        document.addEventListener("contextmenu", displayMenu);
        return () => {
            document.removeEventListener("contextmenu", displayMenu);
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
    function displayMenu(e: MouseEvent) {
        if ((e.target as HTMLElement)?.closest(`#${MODAL_ROOT_ID}`)) {
            return;
        }
        e.preventDefault();

        setTarget(e?.target as HTMLElement);
        show({
            event: e,
        });
    }

    // Track visibility of context menu
    const trackVisibility = (isVisible: boolean) => {
        setIsVisible(isVisible);
    }

    // Handle context menu item click
    function handleItemClick({ id, triggerEvent }: { id: string, triggerEvent: Event }) {
        if (id === "annotate") {
            const target = getQuerySelector(triggerEvent?.target as HTMLElement);
            console.log("Annotate clicked on: " + target);
            navigate(`/add?target=${encodeURIComponent(target)}`);
        }
    }

    return (
        <>
            <Menu id={CONTEXT_MENU_ID} onVisibilityChange={trackVisibility}>
                <Item disabled>DOCUMENT.IO</Item>
                <Separator />
                <Item id="annotate" onClick={handleItemClick as any}> <span className="pr-4">✍️</span> Annotate</Item>
            </Menu>
        </>
    );
}