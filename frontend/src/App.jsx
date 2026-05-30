import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')

  // Sare todos fetch karo
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/todos`)
      setTodos(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Naya todo add karo
  const addTodo = async (e) => {
    e.preventDefault()
    if (!title) return
    try {
      await axios.post(`${API_URL}/api/todos`, { title })
      setTitle('')
      fetchTodos()
    } catch (err) {
      console.log(err)
    }
  }

  // Todo complete/incomplete karo
  const toggleTodo = async (id) => {
    try {
      await axios.put(`${API_URL}/api/todos/${id}`)
      fetchTodos()
    } catch (err) {
      console.log(err)
    }
  }

  // Todo delete karo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`)
      fetchTodos()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container">
      <h1>Todo App 🚀</h1>

      {/* Add Todo Form */}
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Naya todo likho..."
        />
        <button type="submit">Add</button>
      </form>

      {/* Todo List */}
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <span
              onClick={() => toggleTodo(todo._id)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App