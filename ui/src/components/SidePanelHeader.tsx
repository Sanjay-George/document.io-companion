import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PanelOrientationContext } from "@/App";
import { ReloadIcon } from "./icons/ReloadIcon";
import HorizontalLayoutIcon from "./icons/HorizontalLayoutIcon";
import VerticalLayoutIcon from "./icons/VerticalLayoutIcon";
import { PanelOrientation } from "@/models/panelOrientation";
import RightArrowIcon from "./icons/RightArrowIcon";
import Tooltipped from "./Tooltipped";


export default function SidePanelHeader({ title, canGoBack, showNavigationButtons = false, showOrientationButtons = true }
    : { title: string, canGoBack?: boolean, showNavigationButtons?: boolean, showOrientationButtons?: boolean }) {

    const navigate = useNavigate();
    const { panelOrientation, setPanelOrientation } = useContext(PanelOrientationContext) as any;

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

    const HorizontalLayoutButton = () => (<div className={buttonClasses} onClick={() => setPanelOrientation(PanelOrientation.HORIZONTAL)}> <HorizontalLayoutIcon /></div >)
    const VerticalLayoutButton = () => (<div className={buttonClasses} onClick={() => setPanelOrientation(PanelOrientation.VERTICAL)}><VerticalLayoutIcon /></div>)

    return (
        <>
            <div className='flex items-center space-x-4 text-primary justify-between @xl:mb-2'>
                <div className="inline-flex space-x-2 items-center">
                    {
                        canGoBack
                        &&
                        <button onClick={() => navigate(-1)}><LeftArrowIcon /></button>
                    }
                    <H2>{title}</H2>
                </div>

                <div className="inline-flex items-center justify-end space-x-1">
                    {showNavigationButtons && (
                        <>
                            {/* TODO: Remove navigation buttons, instead change to allowNavigation flag
                                    to prevent navigation while editing annotation
                            */}
                            {Tooltipped(BackButton, "Go back", {})}
                            {Tooltipped(ForwardButton, "Go forward", {})}
                            {Tooltipped(ReloadButton, "Reload", {})}
                        </>
                    )}

                    {showOrientationButtons && (
                        <>
                            <div className="border-l border-slate-300 h-5 !ml-3 !mr-1"></div>
                            {
                                panelOrientation === PanelOrientation.VERTICAL && (Tooltipped(HorizontalLayoutButton, "Horizontal layout", {}, 'bottom-end'))
                            }

                            {
                                panelOrientation !== PanelOrientation.VERTICAL && (Tooltipped(VerticalLayoutButton, "Vertical layout", {}))
                            }
                        </>
                    )}

                </div>
            </div >
        </>
    );
}