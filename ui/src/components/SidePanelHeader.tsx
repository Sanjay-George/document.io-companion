import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PanelPositionContext } from "@/App";
import { ReloadIcon } from "./icons/ReloadIcon";
import MoveDownIcon from "./icons/MoveDownIcon";
import MoveLeftIcon from "./icons/MoveLeftIcon";
import RightArrowIcon from "./icons/RightArrowIcon";
import { Tooltip } from 'react-tooltip'


export type PanelPosition = 'left' | 'bottom';

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
                    className="!z-10 !rounded-md !m-0"
                    offset={2}
                    style={{ padding: '0px 8px', fontSize: '12px' }}
                />

                <div className="inline-flex items-center justify-end space-x-1">
                    {/* <div
                        data-tooltip-id="side-panel-tooltip"
                        data-tooltip-content="Go back"
                        data-tooltip-place="bottom"
                        className="text-slate-400 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1"
                        onClick={handleBackClick}>
                        <LeftArrowIcon />
                    </div>

                    <div
                        data-tooltip-id="side-panel-tooltip"
                        data-tooltip-content="Go forward"
                        data-tooltip-place="bottom"
                        className="text-slate-400 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1"
                        onClick={handleForwardClick}>
                        <RightArrowIcon />
                    </div> */}

                    <div
                        data-tooltip-id="side-panel-tooltip"
                        data-tooltip-content="Reload page"
                        data-tooltip-place="bottom"
                        className="text-slate-400 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1"
                        onClick={handleReloadClick}>
                        <ReloadIcon />
                    </div>
                    {
                        panelPosition === 'left' && (
                            <div
                                data-tooltip-id="side-panel-tooltip"
                                data-tooltip-content="Move panel to bottom"
                                data-tooltip-place="bottom"
                                className="text-slate-400 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1"
                                onClick={() => setPanelPosition('bottom')}>
                                <MoveDownIcon />
                            </div>
                        )
                    }

                    {
                        panelPosition === 'bottom' && (
                            <div
                                data-tooltip-id="side-panel-tooltip"
                                data-tooltip-content="Move panel to left"
                                data-tooltip-place="bottom"
                                className="text-slate-400 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1" onClick={() => setPanelPosition('left')}>
                                <MoveLeftIcon />
                            </div>
                        )
                    }

                </div>
            </div >
        </>
    );
}