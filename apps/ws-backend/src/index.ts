import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client"
const wss = new WebSocketServer({ port: 8080 })

interface decoded {
    userId?: string;
}

interface User {
    userId: String,
    rooms: String[],
    ws: any
}

const users: User[] = []

wss.on('connection', function connection(ws, request) {

    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get('token')
    if (token) {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (typeof (decoded) === "string") {
            ws.close();
            return;
        }
        if (!decoded || !(decoded as JwtPayload).userId) {
            ws.close();
            return;
        }
        const userId = decoded.userId;
        users.push({
            userId: userId,
            rooms: [],
            ws: ws
        })
    }


    ws.on('message', async function message(data) {
        const parsedData = JSON.parse(data as unknown as string)
        const user = users.find(x => x.ws == ws)
        if (!user) { return; }
        if (parsedData.type == 'join_room') {
            const user = users.find(x => x.ws == ws)
            user?.rooms.push(parsedData.roomId);
        }

        if (parsedData.type == 'leave_room') {
            const user = users.find(x => x.ws == ws)
            if (!user) {
                return;
            }
            user?.rooms.filter(x => x === parsedData.roomId)
        }

        if (parsedData.type == 'chat') {
            if (user.rooms.includes(parsedData.roomId)) {
                await prismaClient.chat.create({
                    data: {
                        roomId: parsedData.roomId,
                        message: parsedData.message,
                        userId: user.userId
                    }
                })
                users.forEach(x => {
                    if (x.rooms.includes(parsedData.roomId)) {
                        x.ws.send(JSON.stringify({
                            type: "chat",
                            message: parsedData.message,
                            roomId: parsedData.roomId
                        }))
                    }
                })
            }
        }
    })

})