import { JWT_SECRET } from "@repo/common/config";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const authorization = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.token;
    if(!token){
        res.status(403).json({message: "Error"});
    }
    // @ts-ignore
    const user = jwt.verify(token, JWT_SECRET);
    if(user){
        // @ts-ignore
        req.userId = user.id;
    } else {
        res.status(404).json({message: "Not Authorized"});
    }
    next();
}