import axios from "axios";
import { SERVER_URL } from "@/config";
import { Shape, Tool } from "@/types/tool";

export class DrawClient {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private socket: WebSocket;
    private currentTool: Tool;
    private leftClicked: boolean = false;
    private rightClicked: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, currentTool: Tool) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.currentTool = currentTool;
        this.init();
        this.initSocketHandlers();
        this.initMouseHandlers();

    }

    async init() {
        this.existingShapes = await this.getExistingShapes();
        this.clearCanvas()
    }

    async getExistingShapes() {
        const res = await axios.get(`${SERVER_URL}chats/${this.roomId}`);
        const shapes = res.data.messages.map((shape: string) => {
            return JSON.parse(shape);
        })
        return shapes;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        this.ctx.lineWidth = 1
        this.existingShapes.forEach((shape) => {
            switch (shape.type) {
                case "box":
                    this.drawbox(shape.x, shape.y, shape.width, shape.height);
                    break;
                case "ellipse":
                    this.drawellipse(shape.x, shape.y, shape.width, shape.height);
                    break;
                case "line":
                    this.drawline(shape.startx, shape.starty, shape.endx, shape.endy);
                    break;
                case "draw":
                    break;
                case "eraser":
                    break;
            }
        })
    }

    initSocketHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type == 'chat') {
                this.existingShapes.push(message.message);
            }
            this.clearCanvas();
        }
    }

    initMouseHandlers() {
        // addEventListener("contextmenu", (e) => {

        // })
        addEventListener("mousedown", () => {
            switch (this.currentTool) {
                case "box":
                    this.boxdown();
                    break;
                case "ellipse":
                    this.ellipsedown();
                    break;
                case "line":
                    this.linedown();
                    break;
                case "draw":
                    break;
                case "eraser":
                    break;
            }
        })
        addEventListener("mouseup", () => {
            switch (this.currentTool) {
                case "box":
                    this.boxup();
                    break;
                case "ellipse":
                    this.ellipseup();
                    break;
                case "line":
                    this.lineup();
                    break;
                case "draw":
                    break;
                case "eraser":
                    break;
            }
        })
        addEventListener("mousemove", (e) => {
            this.currentX = e.clientX;
            this.currentY = e.clientY;
            switch (this.currentTool) {
                case "box":
                    this.boxmove();
                    break;
                case "ellipse":
                    this.ellipsemove();
                    break;
                case "line":
                    this.linemove();
                    break;
                case "draw":
                    break;
                case "eraser":
                    break;
            }
        })
    }

    boxdown() {
        this.leftClicked = true;
        this.startX = this.currentX;
        this.startY = this.currentY;
    }
    boxup() {
        if (this.leftClicked == true) {
            this.leftClicked = false;
            const shape: Shape = {
                type: "box",
                x: this.startX,
                y: this.startY,
                width: this.currentX - this.startX,
                height: this.currentY - this.startY
            };
            this.existingShapes.push(shape);
            this.clearCanvas();
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    boxmove() {
        if (this.leftClicked == true) {
            this.clearCanvas();
            this.drawbox(this.startX, this.startY, this.currentX - this.startX, this.currentY - this.startY);
        }
    }
    drawbox(x: number, y: number, width: number, height: number) {
        this.ctx.strokeRect(x, y, width, height);
    }


    ellipsedown() {
        this.leftClicked = true;
        this.startX = this.currentX;
        this.startY = this.currentY;
    }
    ellipseup() {
        if (this.leftClicked == true) {
            this.leftClicked = false;
            const shape: Shape = {
                type: "ellipse",
                x: this.startX,
                y: this.startY,
                width: this.currentX - this.startX,
                height: this.currentY - this.startY
            };
            this.existingShapes.push(shape);
            this.clearCanvas();
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    ellipsemove() {
        if (this.leftClicked == true) {
            this.clearCanvas();
            this.drawellipse(this.startX, this.startY, this.currentX - this.startX, this.currentY - this.startY);
        }
    }
    drawellipse(x: number, y: number, width: number, height: number) {
        const hwidth = width / 2;
        const hheight = height / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(x + hwidth, y + hheight, Math.abs(hwidth), Math.abs(hheight), 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }


    linedown() {
        this.leftClicked = true;
        this.startX = this.currentX;
        this.startY = this.currentY;
    }
    lineup() {
        if (this.leftClicked == true) {
            this.leftClicked = false;
            const shape: Shape = {
                type: "line",
                startx: this.startX,
                starty: this.startY,
                endx: this.currentX,
                endy: this.currentY
            };
            this.existingShapes.push(shape);
            this.clearCanvas();
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    linemove() {
        if (this.leftClicked == true) {
            this.clearCanvas();
            this.drawline(this.startX, this.startY, this.currentX, this.currentY);
        }
    }
    drawline(startx: number, starty: number, endx: number, endy: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(startx, starty);
        this.ctx.lineTo(endx, endy);
        this.ctx.stroke();
    }

}