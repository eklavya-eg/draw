import { SERVER_URL } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {

    const existingShapes: Shape[] = await getExistingShapes(roomId);
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    
    initSocketHandlers(ctx, canvas, socket, existingShapes);

    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let clicked = false;
    let startX = 0;
    let startY = 0;


    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const currentShape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        }
        existingShapes.push(currentShape);
        socket.send(JSON.stringify({
            type: "chat",
            message: currentShape,
            roomId: roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            renewCanvas(ctx, canvas, existingShapes);
            ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY)
        }
    })
}

function renewCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "rgba(255, 255, 255)"
    existingShapes.forEach((shape) => {
        if (shape.type == "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${SERVER_URL}chats/${roomId}`);
    const shapes = res.data.messages.map((shape : string)=>{
        return JSON.parse(shape);
    })
    return shapes;
}

function initSocketHandlers(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, socket: WebSocket, existingShapes: Shape[]){
    socket.onmessage = (event)=>{
        const message = JSON.parse(event.data);
        if(message.type=='chat'){
            existingShapes.push(message.message);
        }
        renewCanvas(ctx, canvas, existingShapes);
    }
}