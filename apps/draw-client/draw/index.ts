import { SERVER_URL } from "@/config";
import { Tool } from "@/types/tool";
import axios from "axios";

type Shape = {
    type: "box",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "ellipse",
    x: number,
    y: number,
    width: number,
    height: number
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, selectedTool: Tool) {

    const existingShapes: Shape[] = await getExistingShapes(roomId)
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renewCanvas(ctx, canvas, existingShapes);
    initSocketHandlers(ctx, canvas, socket, existingShapes);

    switch (selectedTool) {
        case "box":
            boxHandler(canvas, ctx, roomId, existingShapes, socket);
        case "ellipse":
            ellipseHandler(canvas, ctx, roomId, existingShapes, socket);
    }
    
}

function ellipseHandler(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roomId: string, existingShapes: Shape[], socket: WebSocket){
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        let clicked = true;
        let startX = e.clientX;
        let startY = e.clientY;
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const currentShape: Shape = {
            type: "ellipse",
            x: startX,
            y: startY,
            width: e.clientX-startX,
            height: e.clientY-startY
        }
    })
}

function boxHandler(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roomId: string, existingShapes: Shape[], socket: WebSocket){
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
            type: "box",
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
        if (shape.type == "box") {
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