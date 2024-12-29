import { Tooltip } from "react-tooltip";

export default function QuerySelectorTag({ target }: { target: string }) {

    return (
        <div>
            <Tooltip
                id="code-tooltip"
                className="!z-10 !rounded-md !m-0 max-w-lg"
                offset={2}
                style={{ padding: '4px 8px', fontSize: '12px', lineHeight: '1.5' }}
            />

            <code
                className='bg-slate-200/60 text-slate-800
                mb-2 px-2 py-1 rounded-lg text-xs
                max-w-full overflow-x-clip overflow-ellipsis
                h-fit font-mono font-normal inline-block whitespace-nowrap
                '
                data-tooltip-id="code-tooltip"
                data-tooltip-content={target}
                data-tooltip-place="bottom">
                <span className='font-semibold font-sans'>Target: </span> {target}
            </code>
        </div>
    )
}