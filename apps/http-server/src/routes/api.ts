import { Router } from "express";
import { authorization } from "../middlewares/auth";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { createroom, myrooms, rooms, chats, getRoomId, connect } from "../controllers/api";

const router : Router = Router();


router.post("/room", authorization, createroom)

router.get("/myrooms", authorization, myrooms)

router.get("/rooms/:search", authorization, rooms)

router.get("/chats/:roomId", chats)

router.get("/room/:slug", getRoomId)

router.post("/connect/:roomId", connect)

export default router