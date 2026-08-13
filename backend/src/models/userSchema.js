import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    loginAttemps: { type: Number, default: 0 },
    timeOut: { type: Date, default: null },
}, {
    timestamps: true,
    strict: false
})

export default model("User", userSchema)