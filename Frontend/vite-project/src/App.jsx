"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState(null)
  const [editText, setEditText] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)

  const API_URL = "https://todo-fa0b.onrender.com/api/todos"

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setTodos(response.data.data)
      setError("")
    } catch (error) {
      setError("Failed to fetch todos")
      console.error("Error fetching todos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) {
      setError("Todo cannot be empty")
      return
    }

    try {
      const response = await axios.post(API_URL, { title: newTodo })
      setTodos([...todos, response.data.data])
      setNewTodo("")
      showSuccess("Todo added successfully")
    } catch (error) {
      setError("Failed to add todo")
      console.error("Error adding todo:", error)
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setTodos(todos.filter((todo) => todo._id !== id))
      showSuccess("Todo deleted successfully")
    } catch (error) {
      setError("Failed to delete todo")
      console.error("Error deleting todo:", error)
    }
  }

  const startEditing = (todo) => {
    setEditingTodo(todo._id)
    setEditText(todo.title)
  }

  const cancelEditing = () => {
    setEditingTodo(null)
    setEditText("")
  }

  const handleUpdateTodo = async (id) => {
    if (!editText.trim()) {
      setError("Todo cannot be empty")
      return
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, { newTitle: editText })
      setTodos(todos.map((todo) => (todo._id === id ? response.data.data : todo)))
      setEditingTodo(null)
      showSuccess("Todo updated successfully")
    } catch (error) {
      setError("Failed to update todo")
      console.error("Error updating todo:", error)
    }
  }

  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleUpdateTodo(id)
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  return (
    <div className="app-container">
      <div className="todo-app">
        <header>
          <h1>Todo App</h1>
          <p className="subtitle">Organize your tasks efficiently</p>
        </header>

        {error && (
          <div className="message error-message">
            <span className="message-icon">⚠️</span>
            <span>{error}</span>
            <button className="close-button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span className="message-icon">✅</span>
            <span>{success}</span>
            <button className="close-button" onClick={() => setSuccess("")}>
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        <div className="todo-list">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading your todos...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className={`todo-item ${editingTodo === todo._id ? "editing" : ""}`}>
                {editingTodo === todo._id ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, todo._id)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleUpdateTodo(todo._id)} className="save-button">
                        Save
                      </button>
                      <button onClick={cancelEditing} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="todo-content">
                    <span className="todo-title">{todo.title}</span>
                    <div className="todo-actions">
                      <button onClick={() => startEditing(todo)} className="edit-button" aria-label="Edit todo">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="delete-button"
                        aria-label="Delete todo"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App

