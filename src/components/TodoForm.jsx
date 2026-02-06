const TodoForm = ({ newTask, setNewTask, addTask }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask) {
      addTask(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        className="w-full px-3 py-2 bg-white text-black rounded-lg"
        placeholder="What needs to be done?"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
      >
        Add-Task
      </button>
    </form>
  );
};

export default TodoForm;
