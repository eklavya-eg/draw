import axios from "axios";
import { SERVER_URL } from "@/config";
import { DrawStatus, Shape, Tool } from "@/types/tool";

export class DrawClient {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private socket: WebSocket;
    private leftClicked: boolean = false;
    private rightClicked: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;
    private currentTool: Tool = "draw";
    private drawStatus: "N" | "E" = "E";
    private eraserStatus: "N" | "E" = "E";
    private prevDrawX: number = 0;
    private prevDrawY: number = 0;
    private prevEraserX: number = 0;
    private prevEraserY: number = 0;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.currentTool = "draw";
        this.init();
        this.initSocketHandlers();
        this.initMouseHandlers();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
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

    setTool(tool: Tool) {
        this.currentTool = tool
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.strokeStyle = "white"
        this.ctx.lineWidth = 2
        this.existingShapes.forEach((shape) => {
            if (shape.type === "box") {
                this.drawbox(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "ellipse") {
                this.drawellipse(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "line") {
                this.drawline(shape.startx, shape.starty, shape.endx, shape.endy);
            } else if (shape.type === "draw") {
                this.drawdraw(shape.x, shape.y, shape.status);
            } else if (shape.type === "eraser") {
                this.eraserdraw(shape.x, shape.y, shape.status);
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

    destroyMouseHandlers() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHnadler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mouseup", this.mouseUpHnadler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }


    mouseDownHandler = () => {
        if (this.currentTool === "box") {
            this.boxdown();
        } else if (this.currentTool === "ellipse") {
            this.ellipsedown();
        } else if (this.currentTool === "line") {
            this.linedown();
        } else if (this.currentTool === "draw") {
            this.drawdown();
        } else if (this.currentTool === "eraser") {
            this.eraserdown();
        }
    }
    mouseUpHnadler = () => {
        if (this.currentTool === "box") {
            this.boxup();
        } else if (this.currentTool === "ellipse") {
            this.ellipseup();
        } else if (this.currentTool === "line") {
            this.lineup();
        } else if (this.currentTool === "draw") {
            this.drawup();
        } else if (this.currentTool === "eraser") {
            this.eraserup();
        }

    }
    mouseMoveHandler = (e: MouseEvent) => {
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        if (this.currentTool === "box") {
            this.boxmove();
        } else if (this.currentTool === "ellipse") {
            this.ellipsemove();
        } else if (this.currentTool === "line") {
            this.linemove();
        } else if (this.currentTool === "draw") {
            this.drawmove();
        } else if (this.currentTool === "eraser") {
            this.erasermove();
        }

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
        this.ctx.closePath();
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


    drawdown() {
        this.leftClicked = true;
        this.startX = this.currentX;
        this.startY = this.currentY;
    }
    drawup() {
        if (this.leftClicked == true) {
            this.leftClicked = false;
            const shape: Shape = {
                type: "draw",
                x: this.currentX,
                y: this.currentY,
                status: "E"
            };
            this.existingShapes.push(shape);
            this.drawdraw(this.currentX, this.currentY, "E");
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    drawmove() {
        if (this.leftClicked == true) {
            const shape: Shape = {
                type: "draw",
                x: this.currentX,
                y: this.currentY,
                status: "N"
            };
            this.existingShapes.push(shape);
            this.drawdraw(this.currentX, this.currentY, "N");
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    drawdraw(x: number, y: number, status: DrawStatus) {
        if (this.drawStatus == "N") {
            this.ctx.beginPath();
            this.ctx.moveTo(this.prevDrawX, this.prevDrawY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.drawStatus == "E") {

        }
        this.drawStatus = status;
        this.prevDrawX = x;
        this.prevDrawY = y;
    }


    eraserdown() {
        this.leftClicked = true;
        this.startX = this.currentX;
        this.startY = this.currentY;
    }
    eraserup() {
        if (this.leftClicked == true) {
            this.leftClicked = false;
            const shape: Shape = {
                type: "eraser",
                x: this.currentX,
                y: this.currentY,
                status: "E"
            };
            this.existingShapes.push(shape);
            this.eraserdraw(this.currentX, this.currentY, "E");
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    erasermove() {
        if (this.leftClicked == true) {
            const shape: Shape = {
                type: "eraser",
                x: this.currentX,
                y: this.currentY,
                status: "N"
            };
            this.existingShapes.push(shape);
            this.eraserdraw(this.currentX, this.currentY, "N");
            this.socket.send(JSON.stringify({
                type: "chat",
                message: shape,
                roomId: this.roomId
            }));
        }
    }
    eraserdraw(x: number, y: number, status: DrawStatus) {
        this.ctx.lineWidth = 7
        this.ctx.strokeStyle = "black"
        if (this.eraserStatus == "N") {
            this.ctx.beginPath();
            this.ctx.moveTo(this.prevEraserX, this.prevEraserY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.eraserStatus == "E") {

        }
        this.eraserStatus = status;
        this.prevEraserX = x;
        this.prevEraserY = y;
                this.ctx.lineWidth = 2
        this.ctx.strokeStyle = "white"
    }

}