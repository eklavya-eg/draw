import express from 'express';
import jwt from 'jsonwebtoken';
import { SignupSchema, SigninSchema, CreateRoomSchema } from '@repo/common/types'
import { JWT_SECRET } from '@repo/common/config'
import { prismaClient } from '@repo/db/client';
import { authorization } from './middlewares/auth';
import cors from "cors";
import apirouter from './routes/api';
import authrouter from './routes/auth';

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authrouter);
app.use("/api", apirouter);

app.get('/check', function (req, res) {
    res.send("healthy");
})


const PORT = 3001;
app.listen(PORT, async () => {
    console.log("✅ PORT -> 3001");
    try {
        await prismaClient.$connect();
        console.log('✅ Prisma is connected to the database');
    } catch (error) {
        console.error('❌ Failed to connect to the database with Prisma:', error);
    }
})