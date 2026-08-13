import { Schema, model } from "mongoose";

const todoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, default: "otro" },
    dueDate: { type: Date, default: null },
}, {
    timestamps: true,
    strict: false
})

export default model("Todo", todoSchema)
