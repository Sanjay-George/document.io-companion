import { Divider } from "@nextui-org/react";
import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import { Link } from "react-router";

export default function SidePanelHeader({ title, allowGoBack }
    : { title: string, allowGoBack?: boolean }) {
    return (
        <>
            <div className='flex items-center space-x-4 text-primary'>
                {allowGoBack && <Link to="/"><LeftArrowIcon /></Link>}
                <H2>{title}</H2>
            </div>
            <Divider className='mb-5 bg-slate-200' />
        </>
    );
}