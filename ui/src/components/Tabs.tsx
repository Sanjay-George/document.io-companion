import { Link } from "react-router";

interface TabItem {
    label: string;
    count: number;
    key: string;
    link?: string;
}

interface TabProps {
    filter: string;
    items: TabItem[];
    showCount?: boolean;
    onTabSelect?: (key: string) => void;
}

// TODO: Split this component into specific ones. This is too generic handling. Stupid AI coding.
export default function Tabs({ filter, items, showCount = true, onTabSelect }: TabProps) {

    return (
        <ul className="flex w-fit rounded-md bg-slate-100
        cursor-pointer !list-none !m-0 !px-0 !py-0.5">
            {items.map((item, index) => (
                <li key={index} className="first:ms-1 last:me-1 !p-0 h-6 flex items-center text-xs">
                    {onTabSelect ? (
                        <button
                            type="button"
                            onClick={() => onTabSelect(item.key)}
                            className={`inline-block px-3 py-1 rounded-md text-xs font-medium border-0 bg-transparent
                                text-nowrap overflow-x-clip no-underline !text-gray-500
                                ${filter === item.key ? '!bg-white' : 'hover:!text-gray-900 hover:!bg-gray-100'}`}
                            aria-pressed={filter === item.key}
                        >
                            {item.label}{showCount ? ` (${item.count})` : ''}
                        </button>
                    ) : (
                        <Link
                            to={item.link as string}
                            className={`inline-block px-3 py-1 rounded-md text-xs font-medium
                                text-nowrap overflow-x-clip no-underline !text-gray-500
                                ${filter === item.key ? '!bg-white' : 'hover:!text-gray-900 hover:!bg-gray-100'}`}
                            aria-current={filter === item.key ? 'page' : undefined}
                        >
                            {item.label}{showCount ? ` (${item.count})` : ''}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
}
