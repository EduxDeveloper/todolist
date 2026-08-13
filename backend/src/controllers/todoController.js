import todoModel from "../models/todoSchema.js";

const todoController = {};

todoController.getAll = async (req, res) => {
    try {
        const userId = req.user.id;
        const todos = await todoModel.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json(todos);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

todoController.getById = async (req, res) => {
    try {
        const userId = req.user.id;
        const todo = await todoModel.findOne({ _id: req.params.id, userId });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        return res.status(200).json(todo);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

todoController.create = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, priority, category, dueDate } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        
        const newTodo = new todoModel({
            userId,
            title,
            description: description || "",
            priority: priority || "medium",
            category: category || "otro",
            dueDate: dueDate || null
        });
        
        await newTodo.save();
        return res.status(201).json({ message: "Todo created", todo: newTodo });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

todoController.update = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, completed, priority, category, dueDate } = req.body;
        
        const todo = await todoModel.findOne({ _id: req.params.id, userId });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (completed !== undefined) todo.completed = completed;
        if (priority !== undefined) todo.priority = priority;
        if (category !== undefined) todo.category = category;
        if (dueDate !== undefined) todo.dueDate = dueDate;
        
        await todo.save();
        return res.status(200).json({ message: "Todo updated", todo });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

todoController.delete = async (req, res) => {
    try {
        const userId = req.user.id;
        const todo = await todoModel.findOneAndDelete({ _id: req.params.id, userId });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        return res.status(200).json({ message: "Todo deleted" });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

todoController.toggleCompleted = async (req, res) => {
    try {
        const userId = req.user.id;
        const todo = await todoModel.findOne({ _id: req.params.id, userId });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        todo.completed = !todo.completed;
        await todo.save();
        
        return res.status(200).json({ message: "Todo toggled", todo });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

todoController.filter = async (req, res) => {
    try {
        const userId = req.user.id;
        const { priority, completed, category } = req.query;
        
        const filterQuery = { userId };
        
        if (priority) filterQuery.priority = priority;
        if (completed !== undefined) filterQuery.completed = completed === 'true';
        if (category) filterQuery.category = category;
        
        const todos = await todoModel.find(filterQuery).sort({ createdAt: -1 });
        return res.status(200).json(todos);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default todoController;
