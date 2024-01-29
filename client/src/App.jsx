import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { TiTick } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRedo } from "react-icons/fa";
import * as dotenv from "dotenv";
dotenv.config();
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedTodo, setEditedTodo] = useState({ title: '', description: '' ,completed: false});
  
  const url = `${process.env.REACT_APP_BACKENDURL}/api/todo`;
  // console.log();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get(`${url}/getalltodos`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  };

  const handleAddTodo = () => {
    axios.post(`${url}/create`, newTodo)
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodo({ title: '', description: '' });
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  };

  const handleDeleteTodo = (id) => {
    axios.delete(`${url}/delete/todo/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  const handleEdit = (id, title, description) => {
    setEditingId(id);
    setEditedTodo({ title, description });
  };

  const handleSaveEdit = (id) => {
    axios.put(`${url}/update/todo/${id}`, editedTodo)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo._id === id ? response.data : todo
        );
        setTodos(updatedTodos);
        setEditingId(null);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  const handleCompleteTodo = (id) => {
    console.log("first");
    console.log(id);
    const updatedTodo = todos.find(todo => todo._id === id);
    console.log("second");
    editedTodo.completed = !updatedTodo.completed;
    handleSaveEdit(id);
  };

  return (
    <div>
      <h1>Todo List</h1>

      <input
        type="text"
        placeholder="Title"
        value={newTodo.title}
        onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTodo.description}
        onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
      />
      <button onClick={handleAddTodo}>Add Todo</button>

      <div className='todos'>
        {todos.map(todo => (
          <div key={todo._id} className='todo'>
            <div className="upper">
              {editingId === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editedTodo.title}
                    onChange={e => setEditedTodo({ ...editedTodo, title: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editedTodo.description}
                    onChange={e => setEditedTodo({ ...editedTodo, description: e.target.value })}
                  />
                  <button onClick={() => handleSaveEdit(todo._id)}>Save</button>
                </>
              ) : (
                <>
                  {!todo.completed?<strong className='title'>{todo.title}</strong>:<strong><strike className='title'>{todo.title}</strike></strong>}
                  {!todo.completed ? (
                    <button className='icon green' onClick={() => handleCompleteTodo(todo._id)}>
                      <TiTick />
                    </button>
                  ) : (
                    <button className='icon red' onClick={() => handleCompleteTodo(todo._id)}>
                      <FaRedo />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="lower">
            {!todo.completed? <div className="description">{todo.description}</div>: <div className="description"><strike>{todo.description}</strike></div>}
             
              <div className="but-container">
                <button className="icon edit" onClick={() => handleEdit(todo._id, todo.title, todo.description)}>
                  <MdModeEdit />
                </button>
                <button className="icon delete" onClick={() => handleDeleteTodo(todo._id)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;
