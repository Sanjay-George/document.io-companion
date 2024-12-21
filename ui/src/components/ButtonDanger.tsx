import ButtonBase from "./ButtonBase";

export default function ButtonDanger({ text, icon, onClick, href, target }: { text: string, icon: React.ReactNode, onClick?: () => void, href?: string, target?: string }) {

    return (
        <ButtonBase
            text={text}
            icon={icon}
            onClick={onClick}
            href={href}
            target={target}
            styleClasses="!text-danger !border-danger !border-1 !bg-transparent !hover:bg-danger !hover:text-white"
        />
    )
}