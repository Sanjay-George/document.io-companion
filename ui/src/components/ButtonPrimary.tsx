import ButtonBase from "./ButtonBase";

export default function ButtonPrimary({ text, icon, onClick, href, target }: { text: string, icon: React.ReactNode, onClick?: () => void, href?: string, target?: string }) {

    return (
        <>
            <ButtonBase
                text={text}
                icon={icon}
                onClick={onClick}
                href={href}
                target={target}
                className="!text-primary !border-primary !border-solid !border-1 !bg-transparent hover:!bg-primary hover:!text-white"
            />

        </>
    )

}