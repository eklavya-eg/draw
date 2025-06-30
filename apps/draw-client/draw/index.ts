import { SERVER_URL } from "@/config";
import { Tool } from "@/types/tool";
import axios from "axios";

export type Shape = {
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

    clearCanvas(ctx, canvas, existingShapes);
    initSocketHandlers(ctx, canvas, socket, existingShapes);

    switch (selectedTool) {
        case "box":
            boxHandler(canvas, ctx, roomId, existingShapes, socket);
        case "ellipse":
            ellipseHandler(canvas, ctx, roomId, existingShapes, socket);
    }

}

function ellipseHandler(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roomId: string, existingShapes: Shape[], socket: WebSocket) {
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
            type: "ellipse",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        }
        existingShapes.push(currentShape)
        socket.send(JSON.stringify({
            type: "chat",
            message: currentShape,
            roomId: roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            clearCanvas(ctx, canvas, existingShapes);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.lineWidth = 2
            ctx.beginPath();
            const cwidth = (e.clientX - startX) / 2;
            const cheight = (e.clientY - startY) / 2;
            console.log(startX + cwidth, startY + cheight, cwidth, cheight)
            ctx.ellipse(startX+cwidth, startY+cheight, Math.abs(cwidth), Math.abs(cheight), 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    })
}

function boxHandler(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roomId: string, existingShapes: Shape[], socket: WebSocket) {
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
            clearCanvas(ctx, canvas, existingShapes);
            ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY)
        }
    })
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "rgba(255, 255, 255)"
    ctx.lineWidth = 2
    existingShapes.forEach((shape) => {
        if (shape.type == "box") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type == "ellipse") {
            ctx.beginPath();
            const cwidth = shape.width / 2;
            const cheight = shape.height / 2;
            ctx.ellipse(shape.x+cwidth, shape.y+cheight, Math.abs(cwidth), Math.abs(cheight), 0, 0, 2 * Math.PI);
            ctx.stroke();
        }
    })
}

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${SERVER_URL}chats/${roomId}`);
    const shapes = res.data.messages.map((shape: string) => {
        return JSON.parse(shape);
    })
    return shapes;
}

export function initSocketHandlers(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, socket: WebSocket, existingShapes: Shape[]) {
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type == 'chat') {
            existingShapes.push(message.message);
        }
        clearCanvas(ctx, canvas, existingShapes);
    }
}