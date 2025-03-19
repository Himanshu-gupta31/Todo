
import Todo from "../models/todo.models.js";
export const addTodo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Todo cannot be empty" });
    }

    const newTodo = await Todo.create({ title:title });

    return res.status(201).json({
      message: "Todo added successfully",
      data: newTodo,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const UpdateTodo=async(req,res)=>{
    try {
        const {id}=req.params;
        const {newTitle}=req.body;
        if (!newTitle || newTitle.trim() === '') {
            return res.status(400).json({ message: "Todo cannot be empty" });
          }
          const updatedTodo=await Todo.findOneAndUpdate(
            {_id:id},
            {title:newTitle},
            {new:true}
          )
          if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
          }
          return res.status(200).json({
            message: "Todo updated successfully",
            data: updatedTodo,
          });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const deleteTodo=async(req,res)=>{
    try {
        const {id}=req.params;
        const deleteTodo=await Todo.findByIdAndDelete(id)
        if (!deleteTodo) {
            return res.status(404).json({ message: "Todo not found" });
          }
      
          return res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getTodo=async(req,res)=>{
    try {
        const todos=await Todo.find();
        return res.status(200).json({
            message: "Todos fetched successfully",
            data: todos,
          });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}