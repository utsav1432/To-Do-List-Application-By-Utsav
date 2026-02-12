import { useState } from "react";

const TaskItems = ({ task, deleteTask, completeTask, editTask }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const handleEdit = () => {
    if (isEditable && editText.trim() !== "") {
      editTask(task._id, editText);
      setIsEditable(false);
    } else {
      setIsEditable(true);
      setEditText(task.title);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setEditText(task.title);
  };

  return (
    <>
      <li className="list">
        {isEditable ? (
          <div className="edit-mode">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <div className="buttons">
              <button className="save" onClick={handleEdit}>
                Save
              </button>
              <button className="cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => completeTask(task._id)}
                className="task-checkbox"
              />
              <span className={task.completed ? "completed" : ""}>
                {task.title}
              </span>
            </div>
            <div className="buttons">
              <button className="edit" onClick={handleEdit}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </div>
          </>
        )}
      </li>
    </>
  );
};

export default TaskItems;
