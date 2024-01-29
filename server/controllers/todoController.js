// POST /todos
const Todo = require('../models/todoModel');
const createTodo = (req, res) => {
   
    const { title, description } = req.body;

    
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }


    const newTodo = {
        title,
        description,
       
    };


    Todo.create(newTodo)
        .then((createdTodo) => {
            res.status(201).json(createdTodo);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to create todo' });
        });
};

// GET /todos
const getTodos = (req, res) => {

    Todo.find()
        .then((todos) => {
            res.status(200).json(todos);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to get todos' });
        });
};


// PUT /todos/:id
const updateTodo = (req, res) => {

    const { id } = req.params;


    const { title, description,completed } = req.body;
    console.log(req.body);
    const updateObj={};
    if(title) updateObj.title=title;
    if(description) updateObj.description=description;
    if(completed!=undefined) updateObj.completed=completed;
    Todo.findByIdAndUpdate(id, updateObj, { new: true })
        .then((updatedTodo) => {
            if (!updatedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            console.log(updatedTodo);
            res.status(200).json(updatedTodo);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Failed to update todo' });
        });
};

// DELETE /todos/:id
const deleteTodo = (req, res) => {

    const { id } = req.params;


    Todo.findByIdAndDelete(id)
        .then((deletedTodo) => {
            if (!deletedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.status(200).json({ message: 'Todo deleted successfully' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete todo' });
        });
};

module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
};
