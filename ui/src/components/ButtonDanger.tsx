import { Button } from "@nextui-org/button";
// import Link from "next/link";


export default function ButtonDanger({ text, icon, onClick, href, target }: { text: string, icon: React.ReactNode, onClick?: () => void, href?: string, target?: string }) {

    if (href) {
        return (
            <Button href={href} target={target || '_self'} className="text-danger border-danger border-1 bg-transparent hover:bg-danger hover:text-white" variant="flat" radius="sm" size="md">
                {text}
                {icon}
            </Button>
        )
    }
    else if (onClick) {
        return (
            <Button onClick={onClick} className="text-danger border-danger border-1 bg-transparent hover:bg-danger hover:text-white" variant="flat" radius="sm" size="md">
                {text}
                {icon}
            </Button>
        )
    }

    else {
        return (
            <Button className="text-danger border-danger border-1 bg-transparent hover:bg-danger hover:text-white" variant="flat" radius="sm" size="md">
                {text}
                {icon}
            </Button>
        )
    }

}