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
        <ul className="flex flex-wrap text-xs font-medium text-center text-gray-500 mb-3 bg-slate-100 w-fit px-1 py-1 rounded-xl cursor-pointer">
            {items.map((item, index) => (
                <li key={index} className="me-2">
                    <a
                        className={`inline-block px-3 py-1 rounded-lg ${filter === item.key ? 'bg-white' : 'hover:text-gray-900 hover:bg-gray-100'}`}
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
