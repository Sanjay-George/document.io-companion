type ButtonProps = {
    text: string;
    icon: React.ReactNode;
    onClick?: () => void;
    href?: string;
    target?: string;
    className?: string;
};

export default function ButtonBase({ text, icon, onClick, className }: ButtonProps) {

    return (

        <button
            type="button"
            className={`inline-flex justify-center items-center 
                !border-[1px] space-x-2 !py-3 !px-4 !text-sm !rounded-md !h-8
                transition duration-250 ease-in-out text-nowrap overflow-x-clip
                ${className}`}
            onClick={onClick}
        >
            <span>{text}</span>
            <span>{icon}</span>
        </button>

    )

}