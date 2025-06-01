"use client"

import { useState } from 'react';
import { PlusIcon, FolderPlusIcon, PlayPauseIcon, PlusCircleIcon, UserPlusIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { Plus_Jakarta_Sans } from 'next/font/google';

export default function ExpandableBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [istOpen, setIstOpen] = useState(false);
    return (
        <div className="h-screen bg-gray-100">
            <div
                className={`fixed top-1/4 transition-all duration-600 ease-in-out bg-amber-100 text-white w-10 h-[40vh] p-4 shadow-xl cursor-pointer rounded-lg 
          ${isOpen ? "left-2" : "-left-7"}
        `}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Click" : "Click"}
            </div>

            <div
                className={`fixed top-0 left-1/2 transition-all duration-600 ease-in-out bg-green-600 text-white  p-4 cursor-pointer shadow-t-xl
          ${istOpen ? "h-64" : "h-16"}
        `}
                onClick={() => setIstOpen(!istOpen)}
            >
                {istOpen ? "Click" : "Click"}
            </div>
            <PlusIcon className='size-12 border-2 border-gray-800 rounded-lg' />
        </div>
    );
}
