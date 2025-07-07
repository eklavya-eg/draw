import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

const createroom = async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        });
    }
    const slug = parsedData.data?.slug || "";
    const pin = parsedData.data?.pin || "";
    if(pin.length==0){
        const public = true;
    } else{
        const public = false;
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: slug,
                // @ts-ignore
                adminId: req.userId,
                public: public
            }
        })
        res.json({
            slug: slug,
            roomId: room.id
        })
    } catch (e) {
        res.status(411).json({ message: "Slug not available" })
    }
}