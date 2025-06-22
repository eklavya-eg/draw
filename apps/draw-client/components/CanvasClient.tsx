"use client"

import { useSocket } from "@//hooks/useSocket"
import { initDraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { ArrowLeftStartOnRectangleIcon, ArrowLongDownIcon, ArrowLongUpIcon, ArrowTrendingUpIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, BeakerIcon, EllipsisHorizontalIcon, ExclamationTriangleIcon, GlobeAsiaAustraliaIcon, PencilIcon, PhotoIcon, PlusIcon, Square2StackIcon, Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/solid"
import { Tool } from "@/types/tool"

export default function CanvasClient({ roomId }: {
    roomId: string
}) {
    const { socket, loading } = useSocket();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentSelected, setCurrentSelected] = useState<Tool>("draw");

    useEffect(() => {
        if (canvasRef.current && socket && !loading) {
            initDraw(canvasRef.current, roomId, socket, currentSelected);
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }
    }, [canvasRef, roomId, loading, socket, currentSelected]);

    return loading ? (
        <div>
            Connecting to room...
        </div>
    ) : (
        <div className="h-screen overflow-hidden" >
            <div className={`fixed w-full flex justify-center transition-all duration-600 ease-in-out ${isMenuOpen ? "top-4" : "-top-3"}`} >
                <div className="flex justify-between item-center bg-stone-400 h-[3vh] w-[25vw] p-[4px] shadow-xl rounded-md top-4" >
                    {/* open move select draw line arrow box triangle ellipse color eraser background-color grids*/}

                    <button aria-label="open" className="items-center justify-center p-[3px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(v => !v)} >
                        {isMenuOpen ? <ArrowLongUpIcon className="size-5" /> : <ArrowLongDownIcon className="size-5" />}
                    </button>

                    <button aria-label="move" className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md`} >
                        <Squares2X2Icon className="size-5" />
                    </button>

                    <button aria-label="select" className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="select" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="select" ? <PlusIcon className="size-5" /> : <PlusIcon className="size-5" />}
                    </button>

                    <button aria-label="draw" onClick={()=>{
                        setCurrentSelected("draw")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="draw" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="draw" ? <PencilIcon className="size-5" /> : <PencilIcon className="size-5" />}
                    </button>

                    <button aria-label="line" onClick={()=>{
                        setCurrentSelected("line")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="line" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="line" ? <EllipsisHorizontalIcon className="size-5" /> : <EllipsisHorizontalIcon className="size-5" />}
                    </button>

                    <button aria-label="arrow" onClick={()=>{
                        setCurrentSelected("arrow")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="arrow" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="arrow" ? <ArrowTrendingUpIcon className="size-5" /> : <ArrowTrendingUpIcon className="size-5" />}
                    </button>

                    <button aria-label="box" onClick={()=>{
                        setCurrentSelected("box")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="box" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="box" ? <Square2StackIcon className="size-5" /> : <Square2StackIcon className="size-5" />}
                    </button>

                    <button aria-label="triangle" onClick={()=>{
                        setCurrentSelected("triangle")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="triangle" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="triangle" ? <ExclamationTriangleIcon className="size-5" /> : <ExclamationTriangleIcon className="size-5" />}
                    </button>

                    <button aria-label="ellipse" onClick={()=>{
                        setCurrentSelected("ellipse")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected=="ellipse" ? "bg-gray-200" : ""}`} >
                        {currentSelected=="ellipse" ? <GlobeAsiaAustraliaIcon className="size-5" /> : <GlobeAsiaAustraliaIcon className="size-5" />}
                    </button>

                    <button aria-label="color" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" >
                        <BeakerIcon className="size-5" />
                    </button>

                    <button aria-label="background-color" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" >
                        <PhotoIcon className="size-5" />
                    </button>

                    <button aria-label="grids" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" >
                        <TableCellsIcon className="size-5" />
                    </button>

                    <button aria-label="undo" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" >
                        <ArrowUturnLeftIcon className="size-5" />
                    </button>

                    <button aria-label="redo" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" >
                        <ArrowUturnRightIcon className="size-5" />
                    </button>

                    <button aria-label="exit" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" >
                        <ArrowLeftStartOnRectangleIcon className="size-5" />
                    </button>

                </div>
            </div>
            <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>
        </div>
    )
}