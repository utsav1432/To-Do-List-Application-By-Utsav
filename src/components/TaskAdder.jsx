const TaskAdder = ({ addTask, setAddTask, handleAddTask }) => {
  return (
    <form onSubmit={handleAddTask} className="task-adder">
      <input
        type="text"
        value={addTask}
        onChange={(e) => setAddTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button>Add +</button>
    </form>
  )
}

export default TaskAdder