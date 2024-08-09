import {RequestHandler } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import createHttpError from "http-errors";
import { loginSchema, registerSchema } from "../zodSchemas/userZodSchema.js";
import { validateSchema } from "../../utils/utils.js";



export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.session.userId).select("+email").exec();
        if(!user){
            throw createHttpError(404,"User not found")
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};

interface singUpBody{
    username:String,
    email:String,
    password:String
}
export const signUp:RequestHandler<unknown,unknown,singUpBody,unknown> = async (req,res,next)=>{
    const username = req.body.username
    const email = req.body.email
    const rawPassword:string = String(req.body.password)
    try {
        if(!username || !email || !rawPassword){
            throw createHttpError(400,"Parameters missing")
        }
        validateSchema(registerSchema,req.body)
        const existingUsername = await userModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await userModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }
        const hashedPassword:string = await bcrypt.hashSync(rawPassword,10)
        const newUser = await userModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            tables:[]
        })
        req.session.userId= newUser._id
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}




interface loginBody{
    username:string,
    password:string
}
export const login: RequestHandler<unknown, unknown, loginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }
        validateSchema(loginSchema,req.body)
        const user = await userModel.findOne({ username: username }).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password || "");

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).send({message:"Log in Succesfull"});
    } catch (error) {
        next(error);
    }
};
