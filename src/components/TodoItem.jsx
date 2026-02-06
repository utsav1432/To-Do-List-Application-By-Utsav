import React, { useState } from 'react'

const TodoItem = ({ task, updateTask, deleteTask, completeTask}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);

  const editTask = async() => {
    if(!taskTitle){
      alert("Task cannot be empty");
      return;
    }

    const updatedTask = {
      title: taskTitle,
      completed: task.completed
    }

    await updateTask(task._id, updatedTask);
    setIsEditable(false);
  }

  const handleComplete = async() => {
    await completeTask(task._id);
  }

  const handleEditClick = () => {
    if (task.completed) return;

    if (isEditable){
        editTask();
    } else{
        setIsEditable(true);
    }
  }

  return (
        <div className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 
             text-black ${task.completed ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"}`}>

            <input type="checkbox" className='cursor-pointer' checked= {task.completed} onChange={handleComplete} />

            <input type='text' className={`border outline-none w-full bg-transparent rounded-lg ${isEditable ? "border-black/10 px-2" : "border-transparent"} ${task.completed ? "line-through" : ""}`} value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} readOnly={!isEditable} />

            <button className='inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50' onClick={handleEditClick} disabled={task.completed}>
                {isEditable ? "📁" : "✏️"}
            </button>

            <button className='inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50' onClick={() => deleteTask(task._id)} disabled={isEditable}>
                ❌
            </button>
        </div>
  )
}

export default TodoItem