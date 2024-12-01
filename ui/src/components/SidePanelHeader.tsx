import { Divider } from "@nextui-org/react";
import H2 from "./H2";
import LeftArrowIcon from "./icons/LeftArrowIcon";

export default function SidePanelHeader({ title }: { title: string }) {
    return (
        <>
            <div className='flex items-center space-x-4 text-primary'>
                <LeftArrowIcon />
                <H2>{title}</H2>
            </div>
            <Divider className='mb-5 bg-slate-200' />
        </>
    );
}