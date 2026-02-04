import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [titleEdit, setTitleEdit] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://backend-todolist-1ayl.onrender.com/api/tasks`);
      setTodos(response.data.data);
    } catch (error) {
      setError("Failed to get tasks. Please try again later!");
    } 
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodo) {
      setError("Task cannot be empty");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axios.post(`https://backend-todolist-1ayl.onrender.com/api/tasks`, {
        data: {
          title: newTodo,
          completed: false
        }
      });

      setNewTodo("");
      await fetchTodos();
    } catch (error) {
      setError("Failed to add task");
    } 
    setLoading(false);
  };

  const completeTodo = async (id) => {
    setError(null);
    setLoading(true);

    try {
      await axios.put(`https://backend-todolist-1ayl.onrender.com/api/tasks/${id}/toggle`);
      await fetchTodos();
    } catch (error) {
      setError("Failed to update task status");
    } 
    setLoading(false);
  };

  const deleteTodo = async (id) => {
    setError(null);
    setLoading(true);

    try {
      await axios.delete(`https://backend-todolist-1ayl.onrender.com/api/tasks/${id}`);
      await fetchTodos();
    } catch (error) {
      setError("Failed to delete task");
    } 
    setLoading(false);
  };

  const startEdit = (todo) => {
    setEdit(todo._id); 
    setTitleEdit(todo.title);
  };

  const saveEdit = async (id) => {
    if (!titleEdit.trim()) {
      setError("Task cannot be empty");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axios.put(`https://backend-todolist-1ayl.onrender.com/api/tasks/${id}`,
        {
          data: {
            title: titleEdit.trim()
          }
        }
      );

      setEdit(null);
      setTitleEdit("");
      await fetchTodos();
    } catch (error) {
      setError("Failed to update task");
    } 
    setLoading(false);
  };

  const cancelEdit = () => {
    setEdit(null);
    setTitleEdit("");
  };

  const searchTodo = async () => {
    if (!search.trim()) {
      await fetchTodos();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://backend-todolist-1ayl.onrender.com/api/tasks`);
      
      const todoSearch = response.data.data.filter((todo) =>
        todo.title?.toLowerCase().includes(search.toLowerCase().trim())
      );

      setTodos(todoSearch);
    } catch (error) {
      setError("Failed to search tasks");
    }
    setLoading(false);
  };

  const handleAddKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo(e);
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchTodo();
    }
  };

  const handleEdit = (e) => {
     if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
     }
    }

  const clearSearch = () => {
    setSearch("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My To-Do List</h1>
      </header>

      <main className="App-main">
        <div className="input-section">
          <h3>What do you need to do?</h3>
          <form onSubmit={addTodo}>
            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={handleAddKey} placeholder="Enter a new task" className="task-input-field"/>
            <button type="submit" className="add-button">Add</button>
          </form>
        </div>

        <div className="search-section">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearchKey} placeholder="Search tasks..." className="search-input"/>
          <button onClick={searchTodo} className="search-button">Search</button>
          <button onClick={clearSearch} className="clear-search-button">Clear</button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="close-error"> × </button>
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>Loading...</p>
          </div>
        )}

        <div className="task-list">
          {!loading && todos.length === 0 ? (
            <p className="no-tasks">No tasks found. Add a new task above!</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li key={todo._id} className="task-item">
                  <input type="checkbox" checked={todo.completed || false} onChange={() => completeTodo(todo._id)} className="task-checkbox"/>

                  <div className="task-content">
                    {edit === todo._id ? (
                      <div className="edit-mode">
                        <input type="text" value={titleEdit} onChange={(e) => setTitleEdit(e.target.value)} className="edit-input" onKeyDown={handleEdit}/>
                        <button onClick={() => saveEdit(todo._id)} className="save-button">Save</button>
                        <button onClick={cancelEdit} className="cancel-button">Cancel</button>
                      </div>
                    ) : (
                      <span className={`task-title ${todo.completed ? "completed" : ""}`}>{todo.title || "No title"}</span>
                    )}

                    {edit !== todo._id && (
                      <div className="task-actions">
                        <button onClick={() => startEdit(todo)} className="edit-button">Edit</button>
                        <button onClick={() => deleteTodo(todo._id)} className="delete-button">Delete</button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;