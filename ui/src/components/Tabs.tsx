import { FilterType } from "@/views/AnnotationListView";

interface TabItem {
    label: string;
    count: number;
    key: FilterType;
}

interface TabProps {
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    items: TabItem[];
}


export default function Tabs({ filter, setFilter, items }: TabProps) {

    return (
        <ul className="flex w-fit rounded-md bg-slate-100
        cursor-pointer !list-none !m-0 !px-0 !py-0.5">
            {items.map((item, index) => (
                <li key={index} className="first:ms-1 last:me-1 !p-0 h-6 flex items-center">
                    <a
                        className={`inline-block px-3 py-1 rounded-md text-xs font-medium
                            text-nowrap overflow-x-clip no-underline !text-gray-500
                            ${filter === item.key ? '!bg-white' : 'hover:!text-gray-900 hover:!bg-gray-100'}`}
                        onClick={() => setFilter(item.key)}
                        aria-current={filter === item.key ? 'page' : undefined}
                    >
                        {item.label} ({item.count})
                    </a>
                </li>
            ))}
        </ul>
    );
}
