import express from 'express';
import jwt from 'jsonwebtoken';
import { SignupSchema, SigninSchema, CreateRoomSchema } from '@repo/common/types'
import { JWT_SECRET } from '@repo/common/config'
import { prismaClient } from '@repo/db/client';
import { authorization } from './middlewares';

const app = express();
app.use(express.json())

app.get('/check', function (req, res) {
    res.send("healthy");
})

app.post('/signup', async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" })
    }
    const email = parsedData.data?.email || "";
    const password = parsedData.data?.password || "";
    const name = parsedData.data?.name || "";
    try {
        const user = await prismaClient.user.create({
            data: {
                email: email,
                password: password,
                name: name
            }
        });
        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET);
        res.send({
            userId: user.id,
            token: token
        });
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this Email"
        });
    }
})

app.post('/signin', async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" })
    }
    const email = parsedData.data?.email;
    const password = parsedData.data?.password;
    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: email,
                password: password
            }
        });
        if (user) {
            const token = jwt.sign({
                id: user.id
            }, JWT_SECRET);
            res.json({
                userId: user.id,
                token: token
            });
        } else {
            res.json({
                message: "User not found"
            })
        }
    } catch (e) {
        res.status(403).json({
            message: "Error"
        });
    }
})

app.get("/room", authorization, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        });
    }
    const slug = parsedData.data?.slug || "";
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: slug,
                // @ts-ignore
                adminId: req.userId
            }
        })
        res.json({
            roomId: room.id
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    try {
        const chats = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: 'desc'
            },
            take: 50
        });
        res.json({
            messages: chats
        })
    } catch {
        res.status(404).json({
            message: "Error"
        })
    }
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
        const room = await prismaClient.room.findFirst({
            where: {
                slug: slug
            }
        });
        res.json({
            roomId: room?.id
        })
    } catch {
        res.status(404).json({
            message: "Error"
        })
    }
})

const PORT = 3001
app.listen(PORT, async () => {
    console.log("✅ PORT -> 3001")
    try {
        await prismaClient.$connect();
        console.log('✅ Prisma is connected to the database');
    } catch (error) {
        console.error('❌ Failed to connect to the database with Prisma:', error);
    }
})