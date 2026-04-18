import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PanelOrientationContext } from "@/App";
import HorizontalLayoutIcon from "./icons/HorizontalLayoutIcon";
import VerticalLayoutIcon from "./icons/VerticalLayoutIcon";
import { PanelOrientation } from "@/models/panelOrientation";
import Tooltipped from "./Tooltipped";
import MinimizeIcon from "./icons/MinimizeIcon";
import Tabs from "./Tabs";


export default function SidePanelHeader({ title, canGoBack, showOrientationButtons = true, showEditModeToggle = false }
    : { title: string, canGoBack?: boolean, showOrientationButtons?: boolean, showEditModeToggle?: boolean }) {

    const navigate = useNavigate();
    const { panelOrientation, setPanelOrientation, setIsMinimized, editMode, setEditMode } = useContext(PanelOrientationContext) as any;

    const buttonClasses = "text-slate-500 hover:text-slate-950 cursor-pointer transition duration-150 ease-in-out p-1";

    const HorizontalLayoutButton = () => (<div className={buttonClasses} onClick={() => setPanelOrientation(PanelOrientation.HORIZONTAL)}> <HorizontalLayoutIcon /></div >)
    const VerticalLayoutButton = () => (<div className={buttonClasses} onClick={() => setPanelOrientation(PanelOrientation.VERTICAL)}><VerticalLayoutIcon /></div>)
    const MinimizeButton = () => (<div className={buttonClasses} onClick={() => setIsMinimized(true)}><MinimizeIcon /></div>)
    const modeItems = [
        { label: 'View', count: 0, key: 'view' },
        { label: 'Edit', count: 0, key: 'edit' },
    ];

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

                <div className="inline-flex items-center justify-end space-x-2">
                    {showEditModeToggle && (
                        <Tabs
                            filter={editMode ? 'edit' : 'view'}
                            items={modeItems}
                            showCount={false}
                            onTabSelect={(key: string) => setEditMode(key === 'edit')}
                        />
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
                            {Tooltipped(MinimizeButton, "Minimize", {}, 'bottom-end')}
                        </>
                    )}

                </div>
            </div >
        </>
    );
}