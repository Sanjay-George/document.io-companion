import Tooltipped from "./Tooltipped";

export default function CodeBlock({ title, value }: { title: string, value: string }) {

    const CodeElement = () => (
        <code
            className='bg-slate-200/60 text-slate-800
                 px-2 py-1 rounded-lg text-xs
                max-w-full overflow-x-clip overflow-ellipsis
                h-fit font-mono font-normal inline-block whitespace-nowrap
                '
        >
            <span className='font-semibold font-sans'>{title}: </span> {value}
        </code>
    )

    return (
        <div>
            {Tooltipped(CodeElement, value, {}, 'top-start')}
        </div>
    )
}