import { z } from 'zod';

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
    name: z.string().min(3).max(20),
    photo: z.string().optional()
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20)
})
