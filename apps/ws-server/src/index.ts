import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/common/config";
import { parseArgs } from "util";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 5001 }, ()=>{
    console.log("✅ PORT -> 5001");
})

interface User {
    userId: string,
    rooms: Number[],
    ws: WebSocket
}

const users: User[] = []


function authorize(request: IncomingMessage, ws: WebSocket) {
    const url = request.url;
    if (!url) {
        return false;
    }
    const prams = new URLSearchParams(url.split("?")[1]);
    const token = prams.get("token");
    if (!token) {
        return false;
    }
    const user = jwt.verify(token, JWT_SECRET);
    users.push({
        // @ts-ignore
        userId: user.id,
        rooms: [],
        ws: ws
    });
    return true;
}

wss.on("connection", function connection(ws: WebSocket, request: IncomingMessage) {
    if (!authorize(request, ws)) {
        ws.close();
        return;
    }

    ws.on("message", async function message(data) {
        const parsedData = JSON.parse(data as unknown as string);
        const user = users.find(u => u.ws == ws);
        if (!user) {
            ws.close();
            return;
        }
        if (parsedData.type == "join_room") {
            user.rooms.push(Number(parsedData.roomId));
        }
        if (parsedData.type == "leave_room") {
            user.rooms.filter(room => room === Number(parsedData.roomId));
        }
        if (parsedData.type == "chat") {
            if (user.rooms.includes(Number(parsedData.roomId))) {
                const chat = await prismaClient.chat.create({
                    data: {
                        roomId: Number(parsedData.roomId),
                        userId: user.userId,
                        message: parsedData.message
                    }
                })
                users.forEach(user=>{
                    if(user.rooms.includes(Number(parsedData.roomId))){
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: parsedData.message,
                            roomId: Number(parsedData.roomId)
                        }))
                    }
                })
            }
        }
    })
})