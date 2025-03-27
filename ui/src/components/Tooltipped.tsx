import { useState } from "react";
import { Placement, useFloating } from '@floating-ui/react';
import { useHover } from '@floating-ui/react';
import { useInteractions } from '@floating-ui/react';


export default function Tooltipped(Component: React.ComponentType<any>,
    tooltip: string, props: any, placement: Placement = 'bottom') {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: placement,
    });
    const hover = useHover(context, {
        restMs: 500,
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
    ]);

    return (
        <>
            {
                isOpen && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="inline-block px-2 py-1 bg-slate-900 text-xs 
                            rounded-lg text-white z-50
                            transition-opacity duration-300 shadow-xs tooltip
                            max-w-lg
                        "
                    >
                        {tooltip}
                    </div>
                )
            }
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <Component {...props} />
            </div>
        </>
    );
}