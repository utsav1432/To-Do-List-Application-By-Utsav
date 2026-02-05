import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTodoEditable, setIsTodoEditable] = useState(null);
  const [titleEdit, setTitleEdit] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://backend-todolist-1ayl.onrender.com/api/tasks`,
      );
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
          completed: false,
        },
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
      await axios.put(
        `https://backend-todolist-1ayl.onrender.com/api/tasks/${id}/toggle`,
      );
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
      await axios.delete(
        `https://backend-todolist-1ayl.onrender.com/api/tasks/${id}`,
      );
      await fetchTodos();
    } catch (error) {
      setError("Failed to delete task");
    }
    setLoading(false);
  };

  const startEdit = (todo) => {
    setIsTodoEditable(todo._id);
    setTitleEdit(todo.title);
  };

  const saveEdit = async (id) => {
    if (!titleEdit) {
      setError("Task cannot be empty");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axios.put(
        `https://backend-todolist-1ayl.onrender.com/api/tasks/${id}`,
        {
          data: {
            title: titleEdit,
          },
        },
      );

      setIsTodoEditable(null);
      setTitleEdit("");
      await fetchTodos();
    } catch (error) {
      setError("Failed to update task");
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setIsTodoEditable(null);
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
      const response = await axios.get(
        `https://backend-todolist-1ayl.onrender.com/api/tasks`,
      );

      const todoSearch = response.data.data.filter((todo) =>
        todo.title?.toLowerCase().includes(search.toLowerCase().trim()),
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
  };

  const clearSearch = () => {
    setSearch("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="bg-[#172842] min-h-screen py-8">
      <header className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
        <h1 className="text-4xl font-extrabold text-center mb-8 mt-2">
          Manage Your To-Do List
        </h1>
      </header>

      <main className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-5 bg-white">
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-2 text-gray-700 text-center">What do you need to do?</h3>
          <form onSubmit={addTodo} className="flex gap-2 py-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleAddKey}
              placeholder="Enter a new task"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              className="rounded-lg px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Add
            </button>
          </form>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 text-gray-700 text-center">
            Search Tasks
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Search tasks..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none"
              disabled={loading}
            />
            <button
              onClick={searchTodo}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center p-4">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

         <div>
          {!loading && todos.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No tasks found. Add a new task above!
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className={`flex items-center justify-between p-4 border rounded-lg shadow-sm gap-3 ${
                    todo.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-purple-50 border-purple-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => completeTodo(todo._id)}
                      className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      disabled={loading}
                    />

                    <div className="flex-1">
                      {isTodoEditable === todo._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={titleEdit}
                            onChange={(e) => setTitleEdit(e.target.value)}
                            onKeyDown={(e) => handleEditKey(e, todo._id)}
                            className="flex-1 border border-gray-300 rounded px-3 py-1 outline-none"
                            disabled={loading}
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(todo._id)}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            📁
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={loading}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-lg ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {todo.title || "No title"}
                        </span>
                      )}
                    </div>
                  </div>

                  {isTodoEditable !== todo._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(todo)}
                        disabled={loading}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        disabled={loading}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
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
