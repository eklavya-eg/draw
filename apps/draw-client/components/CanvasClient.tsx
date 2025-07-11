"use client"

import { useSocket } from "@//hooks/useSocket"
import { useEffect, useRef, useState } from "react"
import { ArrowLeftStartOnRectangleIcon, ArrowLongDownIcon, ArrowLongUpIcon, ArrowTrendingUpIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, CubeTransparentIcon, EllipsisHorizontalIcon, GlobeAsiaAustraliaIcon, PencilIcon, PlusIcon, Square2StackIcon, TableCellsIcon } from "@heroicons/react/24/solid"
import { Tool } from "@/types/tool"
import { DrawClient } from "@/draw/DrawClientApi"

export default function CanvasClient({ roomId, pin }: {
    roomId: string,
    pin?: string | undefined
}) {
    const { socket, loading } = useSocket();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentSelected, setCurrentSelected] = useState<Tool>("draw");
    const [drawClient, setDrawClient] = useState<DrawClient>();

    useEffect(()=>{
        drawClient?.setTool(currentSelected);
    }, [currentSelected, drawClient])
    
    useEffect(() => {
        if (canvasRef.current && socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: roomId,
                pin: pin || ""
            }))
            const dc = new DrawClient(canvasRef.current, roomId, socket);
            setDrawClient(dc);

            return () => {
                dc.destroyMouseHandlers();
                // socket.send(JSON.stringify({
                //     type: "close_conn",
                // }))
                // socket.close()
            }
        }

    }, [canvasRef, roomId, loading, socket, pin]);

    return loading ? (
        <div>
            Connecting to room...
        </div>
    ) : (
        <div className="h-screen overflow-hidden" >
            <div className={`fixed w-full flex justify-center transition-all duration-600 ease-in-out ${isMenuOpen ? "top-4" : "-top-3"}`} >
                <div className="flex justify-between item-center bg-stone-400 h-[3vh] w-[17vw] p-[4px] shadow-xl rounded-md top-4" >
                    {/* open move select draw line arrow box triangle ellipse color eraser background-color grids*/}

                    <button aria-label="open" className="items-center justify-center p-[3px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(v => !v)} >
                        {isMenuOpen ? <ArrowLongUpIcon className="size-5" /> : <ArrowLongDownIcon className="size-5" />}
                    </button>

                    <button aria-label="select" className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "select" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "select" ? <PlusIcon className="size-5" /> : <PlusIcon className="size-5" />}
                    </button>

                    <button aria-label="draw" onClick={() => {
                        setCurrentSelected("draw")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "draw" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "draw" ? <PencilIcon className="size-5" /> : <PencilIcon className="size-5" />}
                    </button>

                    <button aria-label="eraser" onClick={() => {
                        setCurrentSelected("eraser")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "eraser" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "eraser" ? <CubeTransparentIcon className="size-5" /> : <CubeTransparentIcon className="size-5" />}
                    </button>

                    <button aria-label="line" onClick={() => {
                        setCurrentSelected("line")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "line" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "line" ? <EllipsisHorizontalIcon className="size-5" /> : <EllipsisHorizontalIcon className="size-5" />}
                    </button>

                    <button aria-label="arrow" onClick={() => {
                        setCurrentSelected("arrow")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "arrow" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "arrow" ? <ArrowTrendingUpIcon className="size-5" /> : <ArrowTrendingUpIcon className="size-5" />}
                    </button>

                    <button aria-label="box" onClick={() => {
                        setCurrentSelected("box")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "box" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "box" ? <Square2StackIcon className="size-5" /> : <Square2StackIcon className="size-5" />}
                    </button>

                    <button aria-label="ellipse" onClick={() => {
                        setCurrentSelected("ellipse")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "ellipse" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "ellipse" ? <GlobeAsiaAustraliaIcon className="size-5" /> : <GlobeAsiaAustraliaIcon className="size-5" />}
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