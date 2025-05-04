import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_KEY } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'] ?? ""
    const decoded = jwt.verify(token, JWT_KEY)
    if(typeof(decoded)==="string"){
        res.status(404).json({message: "Error"})
    }
    if (decoded) {
        req.userId = (decoded as JwtPayload).userId;
        next();
    } else {
        res.status(403).json({
            message: 'Not authorized'
        })
    }
}