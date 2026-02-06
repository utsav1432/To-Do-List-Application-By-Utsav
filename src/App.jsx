import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TodoItem from "./components/TodoItem";
import TodoForm from "./components/TodoForm";
import SearchTask from "./components/SearchTask";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const Backend_API = "https://backend-todolist-1ayl.onrender.com/api/tasks";

  const getTasks = async() => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(Backend_API);

      const tasksData = response.data.data;

      console.log(tasksData);
      setTasks(tasksData);
    }catch(error){
      setError("Unable to get tasks. Please try again.");
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async(e) => {
    e.preventDefault();

    if(!newTask){
      setError("Task cannot be empty");
      return;
    }

    try{
      await axios.post(Backend_API, {
        data: {
          title: newTask,
          completed: false
        }
      });
      setNewTask("");
      await getTasks();
    }catch (error){
      setError("Unable to add task. Please try again.");
    }
  }

  const updateTask = async (id, updatedTask) => {
    try{
      await axios.put(`${Backend_API}/${id}`, {
          data: {
            title: updatedTask.title
          }
        });
      await getTasks();
    }catch (error){
      setError("Unable to update task. Please try again.");
    }
  }

  const deleteTask = async (id) => {
    try{
      await axios.delete(`${Backend_API}/${id}`);
      await getTasks();
    } catch(error){
      setError("Unable to delete task. Please try again.")
    }
  }

  const completeTask = async (id) => {
    try{
      await axios.put(`${Backend_API}/${id}/toggle`);
      await getTasks();
    } catch(error){
      setError("Unable to update complete task status. Please try again.")
    }
  }

  const searchTasks = async() =>{
    try{
      const response = await axios.get(Backend_API);

      const taskSearch = response.data.data.filter((task) =>
      task.title?.toLowerCase().includes(search.toLowerCase())
      );

      setTasks(taskSearch);
    } catch (error) {
      setError("Failed to search tasks");
    }
  }

  return (
    <div className="bg-[#172842] min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
        <div className="flex justify-center items-center mb-16">
          <h1 className="text-5xl font-extrabold text-center">Manage Your To-Do List</h1>
        </div>

        {error && (
          <div className="bg-red-500/90 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-white hover:text-gray-200">✕</button>
          </div>
        )}

        <div className="mb-12">
          <SearchTask search={search} setSearch={setSearch} searchTasks={searchTasks} />
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4 text-gray-100">
            What do you need to do?
          </h3>
          <TodoForm newTask={newTask} setNewTask={setNewTask}  addTask={addTask} />
        </div>

        {isLoading && (
          <div className="text-center p-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        )}

        <div>
          {!isLoading && tasks.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No tasks found. Add a new task above!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-y-3">
              {tasks.map((task) => (
                <div key={task._id} className="w-full">
                  <TodoItem task={task} updateTask={updateTask} deleteTask={deleteTask} completeTask={completeTask} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App;
