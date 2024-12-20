import { Divider } from "@nextui-org/react";
import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PanelPositionContext } from "@/App";

export type PanelPosition = 'left' | 'bottom';

export default function SidePanelHeader({ title, shouldGoBack }
    : { title: string, shouldGoBack?: boolean }) {
    const navigate = useNavigate();

    const { panelPosition, setPanelPosition } = useContext(PanelPositionContext) as any;

    const handleReloadClick = () => {
        window.location.reload();
    }

    return (
        <>
            <div className='flex items-center space-x-4 text-primary justify-between'>
                <div className="inline-flex space-x-2">
                    {
                        shouldGoBack
                        &&
                        <button onClick={() => navigate(-1)}><LeftArrowIcon /></button>
                    }
                    <H2>{title}</H2>
                </div>

                <div className="inline-flex items-center justify-end space-x-1">

                    <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1" onClick={handleReloadClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-rotate-ccw size-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    </div>

                    {
                        panelPosition === 'left' && (<div className="text-slate-500 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1" onClick={() => setPanelPosition('bottom')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-bottom-close size-4"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 15h18" /><path d="m15 8-3 3-3-3" /></svg>
                        </div>)
                    }

                    {
                        panelPosition === 'bottom' && (<div className="text-slate-500 hover:text-slate-900 cursor-pointer transition duration-150 ease-in-out p-1" onClick={() => setPanelPosition('left')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-left-close size-4"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m16 15-3-3 3-3" /></svg>
                        </div>)
                    }

                </div>
            </div>
            <Divider className='mb-5 bg-slate-200' />
        </>
    );
}