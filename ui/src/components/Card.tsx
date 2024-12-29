import React from "react";

type CardProps = {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    body: React.ReactNode;
    className?: string;
};

export default function Card({ header, footer, body, className }: CardProps) {
    return (
       
        <div className={`max-w-sm px-3 bg-white border-0 rounded-lg shadow ${className}`}>

            {header && (
                <>
                 <div className="py-2">
                    {header}

                </div>
                    <hr className="h-px bg-gray-100 border-0 " />
                </>
               
            )}


            <div className="py-2">
                {body}
            </div>

            {footer && (
                <>
                    <hr className="h-px bg-gray-100 border-0" />
                    <div className="py-2">
                        {footer}
                    </div>
                </>
               
            )}

        
        </div>


    );
}