import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client"

const app = express()

app.post('/signup', async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
    }
    try {
        const user = await prismaClient.User.create({
            data: {
                email: parsedData.data?.username,
                password: parsedData.data?.password,
                name: parsedData.data?.name
            }
        })
        res.json({
            userId: user.id,
            token: jwt.sign({userId:user.id}, JWT_SECRET)
        })
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post('/signin', async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json( { message: "Incorrect Inputs"} )
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data?.username,
            password: parsedData.data?.password
        }
    })
    if(user){
        res.json({
            token: jwt.sign({userId: user.id}, JWT_SECRET)
        })
    } else{
        res.status(403).json({
            message: "Not authorized"
        })
    }
})

app.post('/room', middleware, async (req, res) => {
    const userId = req.userId;
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({message: "Incorrect Inputs"})
    };
    try{
        const room = await prismaClient.room.create({
            data:{
                slug: parsedData.data?.name,
                adminId: userId
            }
        })
        res.json({
            roomId: room.id,
        })
    } catch(e){
        res.status(411).json({
            message:"Room already taken"
        })
    }
})

app.get('/chats/:roomId', async function(req, res){
    const roomId = Number(req.params.roomId);
    const chats = await prismaClient.room.findMany({
        where:{
            roomId: roomId
        },
        orderBy:{
            id: 'desc'
        },
        take: 50
    })
})

app.listen(3001)