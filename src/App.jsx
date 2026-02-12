import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskAdder from "./components/TaskAdder";
import TaskItems from "./components/TaskItems";
import axios from "axios";

function App() {
  const host = "https://todo-backend-6nh7.onrender.com/api/tasks";
  const [tasks, setTasks] = useState([]);
  const [addTask, setAddTask] = useState("");
  const [error, setError] = useState(null);

  const getTasks = async () => {
    try {
      const res = await axios.get(host);
      setTasks(res.data.data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to get tasks.");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!addTask.trim()){
      setError("Task cannot be empty");
      return;
    }
    setError(null);
    try {
      await axios.post(host, {
        data: { 
          title: addTask, 
          completed: false 
        } 
      });
      setAddTask("");
      await getTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to add task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${host}/${id}`);
      await getTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to delete task.");
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`${host}/${id}/toggle`);
      await getTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to complete task.");
    }
  };

  const editTask = async (id, editTitle) => {
    try {
      await axios.put(`${host}/${id}`, {
        data: { 
          title: editTitle 
        } 
      });
      await getTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to edit task.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="center_container">
          <Header />
          {error && <div className="error">{error}</div>}
          <div className="body">
            <span className="label">What do you need to do?</span>
            <TaskAdder
              addTask={addTask}
              setAddTask={setAddTask}
              handleAddTask={handleAddTask}
            />
            <ol className="lists">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskItems
                    key={task._id}
                    task={task}
                    deleteTask={deleteTask}
                    completeTask={completeTask}
                    editTask={editTask}
                  />
                ))
              ) : (
                <p>No tasks yet. Add your first task!</p>
              )}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
