import { Link } from "react-router";
import { FilterType } from "@/views/AnnotationListView";

type Props = {
    filter: FilterType;
    inPageCount: number | undefined;
    allCount: number | undefined;
    enableReorder?: boolean;
};

export default function AnnotationFilterTabs({ filter, inPageCount, allCount, enableReorder = false }: Props) {
    const items = enableReorder
        ? [{ label: 'All', count: allCount, key: 'all' as FilterType, link: '/?filter=all' }]
        : [
            { label: 'On this page', count: inPageCount, key: 'in-page' as FilterType, link: '/?filter=in-page' },
            { label: 'All', count: allCount, key: 'all' as FilterType, link: '/?filter=all' },
        ];

    return (
        <ul className="flex w-fit rounded-md bg-slate-100 cursor-pointer !list-none !m-0 !px-0 !py-0.5">
            {items.map((item, index) => (
                <li key={index} className="first:ms-1 last:me-1 !p-0 h-6 flex items-center text-xs">
                    <Link
                        to={item.link}
                        className={`inline-block px-3 py-1 rounded-md text-xs font-medium
                            text-nowrap overflow-x-clip no-underline !text-gray-500
                            ${filter === item.key ? '!bg-white' : 'hover:!text-gray-900 hover:!bg-gray-100'}`}
                        aria-current={filter === item.key ? 'page' : undefined}
                    >
                        {item.label} ({item.count})
                    </Link>
                </li>
            ))}
        </ul>
    );
}
