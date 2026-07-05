type Props = {
    editMode: boolean;
    onToggle: (editMode: boolean) => void;
};

const items = [
    { label: 'View', key: 'view' },
    { label: 'Edit', key: 'edit' },
];

export default function EditModeTabs({ editMode, onToggle }: Props) {
    const activeKey = editMode ? 'edit' : 'view';

    return (
        <ul className="flex w-fit rounded-md bg-slate-100 cursor-pointer !list-none !m-0 !px-0 !py-0.5">
            {items.map((item, index) => (
                <li key={index} className="first:ms-1 last:me-1 !p-0 h-6 flex items-center text-xs">
                    <button
                        type="button"
                        onClick={() => onToggle(item.key === 'edit')}
                        className={`inline-block px-3 py-1 rounded-md text-xs font-medium border-0 bg-transparent
                            text-nowrap overflow-x-clip no-underline !text-gray-500
                            ${activeKey === item.key ? '!bg-white' : 'hover:!text-gray-900 hover:!bg-gray-100'}`}
                        aria-pressed={activeKey === item.key}
                    >
                        {item.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}
