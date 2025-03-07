import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PanelPositionContext } from "@/App";
import { ReloadIcon } from "./icons/ReloadIcon";
import HorizontalLayoutIcon from "./icons/HorizontalLayoutIcon";
import VerticalLayoutIcon from "./icons/VerticalLayoutIcon";
import { PanelPosition } from "@/models/panelPosition";
import RightArrowIcon from "./icons/RightArrowIcon";
import Tooltipped from "./Tooltipped";




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

    const buttonClasses = "text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1";

    const BackButton = () => (<div className={buttonClasses} onClick={handleBackClick}><LeftArrowIcon /></div>)
    const ForwardButton = () => (<div className={buttonClasses} onClick={handleForwardClick}><RightArrowIcon /></div>)
    const ReloadButton = () => (<div className={buttonClasses} onClick={handleReloadClick}><ReloadIcon /></div>)
    const HorizontalLayoutButton = () => (<div className={buttonClasses} onClick={() => setPanelPosition(PanelPosition.BOTTOM)}><HorizontalLayoutIcon /></div>)
    const VerticalLayoutButton = () => (<div className={buttonClasses} onClick={() => setPanelPosition(PanelPosition.RIGHT)}><VerticalLayoutIcon /></div>)

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

                <div className="inline-flex items-center justify-end space-x-1">
                    {Tooltipped(BackButton, "Go back", {})}
                    {Tooltipped(ForwardButton, "Go forward", {})}
                    {Tooltipped(ReloadButton, "Reload", {})}

                    <div className="border-l border-slate-300 h-5 !ml-3 !mr-1"></div>

                    {
                        panelPosition === PanelPosition.RIGHT && Tooltipped(HorizontalLayoutButton, "Horizontal layout", {}, 'bottom-end')
                    }

                    {
                        panelPosition !== PanelPosition.RIGHT && Tooltipped(VerticalLayoutButton, "Vertical layout", {})
                    }

                </div>
            </div >
        </>
    );
}