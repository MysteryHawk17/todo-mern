const { createTodo, getTodos, deleteTodo, updateTodo } = require("../controllers/todoController");

const router=require("express").Router();



//post todo
router.post("/create",createTodo);
//get all todo
router.get("/getalltodos",getTodos);
//delete todo
router.delete("/delete/todo/:id",deleteTodo);
//update todo
router.put("/update/todo/:id",updateTodo);

module.exports=router;