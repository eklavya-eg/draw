"use client"

import { useRef, useState } from 'react';

export default function ExpandableBox() {
    const [isOpen, setIsOpen] = useState(false);
    const isHovering = useRef(false);
    const [istOpen, setIstOpen] = useState(false);
    return (
        <div className="h-screen bg-stone-950">
            <div
                className={`fixed top-1/4 transition-all duration-600 ease-in-out bg-stone-100 text-white w-10 h-[40vh] p-4 shadow-xl rounded-lg 
          ${isOpen ? "left-5" : "-left-7"}
        `}
                // onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => {
                    isHovering.current = true;
                    setIsOpen(true);
                }}
                onMouseLeave={() => {
                    isHovering.current = false;
                    setTimeout(() => {
                        if (!isHovering.current) {
                            setIsOpen(false);
                        }
                    }, 1000); // 3 seconds delay
                }
                }
            >

            </div>

            <div
                className={`fixed top-0 left-1/2 transition-all duration-600 ease-in-out bg-green-600 text-white  p-4 cursor-pointer shadow-t-xl
          ${istOpen ? "h-64" : "h-16"}
        `}
                onClick={() => setIstOpen(!istOpen)}
            >
                {istOpen ? "Click" : "Click"}
            </div>
        </div>
    );
}
