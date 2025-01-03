import React from "react";

type CardProps = {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    body: React.ReactNode;
    className?: string;
};

export default function Card({ header, footer, body, className }: CardProps) {
    return (

        <div className={`max-w-sm px-3 border-0 
            bg-white shadow-md rounded-xl 
            flex flex-col justify-space-between
            ${className}`}>

            {header && (
                <>
                    <div className="py-2">
                        {header}
                    </div>
                    <hr className="h-px bg-gray-100 border-0" />
                </>

            )}


            <div className="py-2 flex-1">
                {body}
            </div>

            {footer && (
                <>
                    <hr className="h-px bg-gray-100 border-0" />
                    <div className="py-2 overflow-x-clip">
                        {footer}
                    </div>
                </>

            )}


        </div>


    );
}