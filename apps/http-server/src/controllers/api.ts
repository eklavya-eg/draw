import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import { authorization } from "../middlewares/auth";

export const createroom = async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        });
    }
    const slug = parsedData.data?.slug || "";
    const pin = parsedData.data?.pin || "";
    const public_ = pin.length === 0 ? true : false
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: slug,
                // @ts-ignore
                adminId: req.userId,
                // @ts-ignore
                public: public_,
                pin: pin
            }
        })
        res.json({
            slug: slug,
            roomId: room.id,
            public: public_
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
}

export const myrooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prismaClient.room.findMany({
            where: {
                // @ts-ignore
                adminId: req.userId
            },
            select: {
                id: true,
                slug: true,
                // @ts-ignore
                public: true
            }
        })
        res.json({
            rooms: rooms.map((room) => {
                return {
                    slug: room.slug,
                    roomId: room.id,
                    // @ts-ignore
                    public: room.public
                };
            })
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
}

export const rooms = async (req: Request, res: Response) => {
    const search = req.params.search ? req.params.search : "";
    try {
        const rooms = await prismaClient.room.findMany({
            where: {
                slug: {
                    startsWith: search
                }
            },
            select: {
                slug: true,
                id: true,
                // @ts-ignore
                public: true
            },
            take: 3
        })
        res.json({
            rooms: rooms.map((room) => {
                return {
                    slug: room.slug,
                    roomId: room.id,
                    // @ts-ignore
                    public: room.public
                };
            })
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
}

export const chats = async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId);
    try {
        const chats = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            select: {
                message: true
            },
            orderBy: {
                id: 'desc'
            },
        });
        if (chats) {
            res.json({
                messages: chats.map(chat => chat.message)
            })
        }
    } catch {
        res.status(404).json({
            message: "Error"
        })
    }
}

export const getRoomId = async (req: Request, res: Response) => {
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
}

export const connect = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const pin = req.query.pin as string || undefined;
    if (!roomId || pin === undefined) {
        res.status(400).json({
            message: "Incorrect Inputs"
        })
    }
    try {
        const room = await prismaClient.room.findFirst({
            where: {
                id: Number(roomId),
                // @ts-ignore
                pin: pin
            }
        });

        if (room) {
            res.json({
                authorized: true
            })
        } else {
            res.json({
                authorized: false
            })
        }
    } catch {
        res.status(404).json({
            message: "Error"
        })
    }
}

export const deletee = async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    // @ts-ignore
    const userId = req.userId;
    try {
        const room = await prismaClient.room.findFirst({
            where: {
                id: Number(roomId),
                adminId: userId,
            },
        });
        if (!room) {
            res.status(411).json({
                message: "Unquthorized access"
            });
            return;
        }
        const deleteRoom = await prismaClient.room.delete({
            where: {
                id: Number(roomId),

            }
        })
        if (room) {
            res.json({
                message: "Success"
            });
        }
    } catch {
        res.status(404).json({
            message: "Error"
        });
    }
}