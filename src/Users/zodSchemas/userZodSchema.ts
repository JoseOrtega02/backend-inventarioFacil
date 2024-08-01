import {z} from "zod"
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
export const loginSchema = z.object({
    username: z.string()
    .min(1,{ message: 'Username cannot be empty' })
    .regex(usernameRegex, { message: 'Username must be 3-30 characters long and can only contain letters, numbers, underscores, and hyphens' }),
    password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(passwordRegex, {
      message: 'Password must contain at least one uppercase letter, one number, and one special character',
    }),
  }).required();
export const registerSchema = z.object({
    username: z.string()
    .min(1,{ message: 'Username cannot be empty' })
    .regex(usernameRegex, { message: 'Username must be 3-30 characters long and can only contain letters, numbers, underscores, and hyphens' }),
    email: z.string().email(),
    password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(passwordRegex, {
      message: 'Password must contain at least one uppercase letter, one number, and one special character',
    }),
}).required()