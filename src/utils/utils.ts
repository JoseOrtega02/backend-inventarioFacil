import createHttpError from "http-errors";
import { ZodSchema } from "zod";

export const validateSchema = (schema:ZodSchema,data:object) =>{
    const Validate = schema.safeParse(data)
    if(!Validate.success){
        const msg = Validate.error.errors.map((err) => {return err.message  } ).toString()
        console.log(Validate.error.errors)
        throw createHttpError(500,msg)
    }
} 