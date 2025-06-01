"use client"

import { useSocket } from "@//hooks/useSocket"
import { initDraw } from "@/draw"
import { useEffect, useRef } from "react"

export default function CanvasClient({ roomId }: {
    roomId: string
}) {
    const { socket, loading } = useSocket();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && socket && !loading) {
            initDraw(canvasRef.current, roomId, socket);
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }
    }, [canvasRef, roomId, loading, socket]);

    return loading ? (
        <div>
            Connecting to room...
        </div>
    ) : (
        <div>
            <canvas ref={canvasRef} height={2000} width={2000}></canvas>
        </div>
    )
}