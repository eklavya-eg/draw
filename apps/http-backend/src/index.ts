import express from "express";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client"

const app = express()

app.post('/signup', (req, res)=>{
    
})

app.post('/signin', (req, res)=>{

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_KEY)
    res.json({
        token: token
    })
})

app.post('/room', middleware, (req, res)=>{

})


app.listen(3000)