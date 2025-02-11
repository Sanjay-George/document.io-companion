import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PanelPositionContext } from "@/App";
import { ReloadIcon } from "./icons/ReloadIcon";
import HorizontalLayoutIcon from "./icons/HorizontalLayoutIcon";
import VerticalLayoutIcon from "./icons/VerticalLayoutIcon";
import { Tooltip } from 'react-tooltip'
import { PanelPosition } from "@/models/panelPosition";
import RightArrowIcon from "./icons/RightArrowIcon";


export default function SidePanelHeader({ title, shouldGoBack }
    : { title: string, shouldGoBack?: boolean }) {
    const navigate = useNavigate();
    const { panelPosition, setPanelPosition } = useContext(PanelPositionContext) as any;

    const handleReloadClick = () => {
        window.location.reload();
    }
    const handleBackClick = () => {
        window.history.back();
    }
    const handleForwardClick = () => {
        window.history.forward();
    }

    return (
        <>
            <div className='flex items-center space-x-4 text-primary justify-between @xl:mb-2'>
                <div className="inline-flex space-x-2">
                    {
                        shouldGoBack
                        &&
                        <button onClick={() => navigate(-1)}><LeftArrowIcon /></button>
                    }
                    <H2>{title}</H2>
                </div>

                <Tooltip
                    id="side-panel-tooltip"
                    className="!z-10 !rounded-md !m-0 !text-xs !py-1 !px-2"
                    offset={2}
                />

                <div className="inline-flex items-center justify-end space-x-1">
                    <div
                        data-tooltip-id="browser-controls-tooltip"
                        data-tooltip-place="bottom"
                        className="text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1"
                        onClick={handleBackClick}
                    >
                        <LeftArrowIcon />
                    </div>

                    <div
                        data-tooltip-id="browser-controls-tooltip"
                        data-tooltip-place="bottom"
                        className="text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1"
                        onClick={handleForwardClick}
                    >
                        <RightArrowIcon />
                    </div>

                    <div
                        data-tooltip-id="browser-controls-tooltip"
                        data-tooltip-place="bottom"
                        className="text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1"
                        onClick={handleReloadClick}
                    >
                        <ReloadIcon />
                    </div>

                    <div className="border-l border-slate-300 h-5 !ml-3 !mr-1"></div>

                    {
                        panelPosition === PanelPosition.RIGHT && (
                            <div
                                data-tooltip-id="side-panel-tooltip"
                                data-tooltip-content="Horizontal layout"
                                data-tooltip-place="bottom"
                                className="text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1"
                                onClick={() => setPanelPosition(PanelPosition.BOTTOM)}>
                                <HorizontalLayoutIcon />
                            </div>
                        )
                    }

                    {
                        panelPosition !== PanelPosition.RIGHT && (
                            <div
                                data-tooltip-id="side-panel-tooltip"
                                data-tooltip-content="Vertical layout"
                                data-tooltip-place="bottom"
                                className="text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1" onClick={() => setPanelPosition(PanelPosition.RIGHT)}>
                                <VerticalLayoutIcon />
                            </div>
                        )
                    }

                </div>
            </div >
        </>
    );
}