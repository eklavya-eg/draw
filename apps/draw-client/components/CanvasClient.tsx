"use client"

import { useSocket } from "@//hooks/useSocket"
import { useEffect, useRef, useState } from "react"
import { ArrowLeftStartOnRectangleIcon, ArrowLongDownIcon, ArrowLongUpIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Tool } from "@/types/tool"
import { DrawClient } from "@/draw/DrawClientApi"
import { Circle, Eraser, Pencil, PenLine, Square } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CanvasClient({ roomId, pin }: {
    roomId: string,
    pin?: string | undefined
}) {
    const { socket, loading } = useSocket();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentSelected, setCurrentSelected] = useState<Tool>("draw");
    const [drawClient, setDrawClient] = useState<DrawClient>();
    const router = useRouter();

    useEffect(() => {
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
                socket.send(JSON.stringify({
                    type: "close_conn",
                }))
                router.push("/dashboard")
            }
        }

    }, [canvasRef, roomId, loading, socket, router, pin]);

    useEffect(() => {
        const handleUnload = () => {
            drawClient?.destroyMouseHandlers();
            socket?.send(JSON.stringify({ type: "close_conn" }));
            socket?.close();
        };

        window.addEventListener("beforeunload", handleUnload);
        window.addEventListener("popstate", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            window.removeEventListener("popstate", handleUnload);
        };
    }, [drawClient, socket]);


    return loading ? (
        <div>
            Connecting to room...
        </div>
    ) : (
        <div className="h-screen overflow-hidden" >
            <div className={`fixed w-full flex justify-center transition-all duration-600 ease-in-out ${isMenuOpen ? "top-4" : "-top-3"}`} >
                <div className="flex justify-between items-center bg-stone-400 h-[3vh] w-[15vw] p-[4px] shadow-xl rounded-md top-4" >
                    {/* open move select draw line arrow box triangle ellipse color eraser background-color grids*/}

                    <button aria-label="open" className="items-center justify-center p-[3px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(v => !v)} >
                        {isMenuOpen ? <ArrowLongUpIcon className="w-5 h-5" /> : <ArrowLongDownIcon className="w-5 h-5" />}
                    </button>

                    <button aria-label="select" className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "select" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "select" ? <PlusIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                    </button>

                    <button aria-label="draw" onClick={() => {
                        setCurrentSelected("draw")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "draw" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "draw" ? <Pencil className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                    </button>

                    <button aria-label="eraser" onClick={() => {
                        setCurrentSelected("eraser")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "eraser" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "eraser" ? <Eraser className="w-5 h-5" /> : <Eraser className="w-5 h-5" />}
                    </button>

                    <button aria-label="line" onClick={() => {
                        setCurrentSelected("line")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "line" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "line" ? <PenLine className="w-5 h-5" /> : <PenLine className="w-5 h-5" />}
                    </button>


                    <button aria-label="box" onClick={() => {
                        setCurrentSelected("box")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "box" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "box" ? <Square className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>

                    <button aria-label="ellipse" onClick={() => {
                        setCurrentSelected("ellipse")
                    }} className={`items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md ${currentSelected == "ellipse" ? "bg-gray-200" : ""}`} >
                        {currentSelected == "ellipse" ? <Circle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>


                    <button aria-label="exit" className="items-center justify-center p-[2px] h-[1.3vw] w-[1.2vw] hover:bg-gray-100 rounded-md" onClick={() => {
                        if (drawClient === undefined || socket === null) {
                            router.push("/dashboard");
                            return;
                        }
                        (drawClient as DrawClient).destroyMouseHandlers();
                        (socket as WebSocket).send(JSON.stringify({
                            type: "close_conn",
                        }));
                        router.push("/dashboard");
                    }} >
                        <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                    </button>

                </div>
            </div>
            <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>
        </div>
    )
}