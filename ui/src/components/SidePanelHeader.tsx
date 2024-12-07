import { Divider } from "@nextui-org/react";
import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { useNavigate } from "react-router";

export default function SidePanelHeader({ title, shouldGoBack }
    : { title: string, shouldGoBack?: boolean }) {
    const navigate = useNavigate();
    return (
        <>
            <div className='flex items-center space-x-4 text-primary'>
                {
                    shouldGoBack
                    &&
                    <button onClick={() => navigate(-1)}><LeftArrowIcon /></button>
                }
                <H2>{title}</H2>
            </div>
            <Divider className='mb-5 bg-slate-200' />
        </>
    );
}