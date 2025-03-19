import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://localhost:8000/api/todos';

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data.data);
    } catch (error) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError('Todo cannot be empty');
      return;
    }

    try {
      const response = await axios.post(API_URL, { title: newTodo });
      setTodos([...todos, response.data.data]);
      setNewTodo('');
      setSuccess('Todo added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add todo');
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      setSuccess('Todo deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditText(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditText('');
  };

  const handleUpdateTodo = async (id) => {
    if (!editText.trim()) {
      setError('Todo cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, { newTitle: editText });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.data : todo
      ));
      setEditingTodo(null);
      setSuccess('Todo updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update todo');
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <button type="submit" className="add-button">Add Todo</button>
      </form>
      
      <div className="todo-list">
        {todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div key={todo._id} className="todo-item">
              {editingTodo === todo._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleUpdateTodo(todo._id)} className="save-button">Save</button>
                    <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="todo-content">
                  <span className="todo-title">{todo.title}</span>
                  <div className="todo-actions">
                    <button onClick={() => startEditing(todo)} className="edit-button">Edit</button>
                    <button onClick={() => handleDeleteTodo(todo._id)} className="delete-button">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;