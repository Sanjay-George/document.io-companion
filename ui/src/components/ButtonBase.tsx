import { Button } from "@nextui-org/button";

export default function ButtonBase({ text, icon, onClick, href, target, styleClasses }: { text: string, icon: React.ReactNode, onClick?: () => void, href?: string, target?: string, styleClasses: string }) {

    if (href) {
        return (
            <Button href={href} target={target || '_self'} className={`py-3 px-4 text-sm rounded-md ${styleClasses}`} variant="flat" radius="none" size="sm" >
                {text}
                {icon}
            </Button >
        )
    }
    else if (onClick) {
        return (
            <Button onClick={onClick} className={`py-3 px-4 text-sm rounded-md ${styleClasses}`} variant="flat" radius="none" size="sm">
                {text}
                {icon}
            </Button>
        )
    }

    else {
        return (
            <Button className={`py-3 px-4 text-sm rounded-md ${styleClasses}`} variant="flat" radius="none" size="sm">
                {text}
                {icon}
            </Button>
        )
    }

}