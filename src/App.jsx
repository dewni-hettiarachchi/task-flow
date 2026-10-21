
import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
  try {
    const savedTasks = localStorage.getItem("taskflow-tasks");

    if (savedTasks !== null) {
      return JSON.parse(savedTasks);
    }
  } catch (error) {
    console.error("Could not load saved tasks:", error);
  }

  return [
    { id: 1, title: "Learn React", priority: "High", completed: false },
    { id: 2, title: "Build TaskFlow", priority: "Medium", completed: false },
    { id: 3, title: "Create first component", priority: "Low", completed: true },
  ];
});

  useEffect(() => {
  const savedTasks = localStorage.getItem("taskflow-tasks");

  if (savedTasks !== null) {
    try {
      setTasks(JSON.parse(savedTasks));
    } catch {
      console.error("Could not load saved tasks.");
    }
  }
}, []);

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  useEffect(() => {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}, [tasks]);

  function handleAddTask(e) {
  e.preventDefault();

  if (!newTask.trim()) return;

  const newTaskItem = {
    id: Date.now(),
    title: newTask.trim(),
    priority: newPriority,
    completed: false,
  };

  setTasks((prevTasks) => [...prevTasks, newTaskItem]);

  setNewTask("");
  setNewPriority("Medium");
}

  function handleDeleteTask(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  setTasks((prev) => prev.filter((task) => task.id !== id));
}

 function handleSaveEdit(id) {
  if (!editText.trim()) return;

  setTasks((prev) =>
    prev.map((task) =>
      task.id === id
        ? {
            ...task,
            title: editText.trim(),
            priority: editPriority,
          }
        : task
    )
  );

  setEditingId(null);
  setEditText("");
  setEditPriority("Medium");
}

  function handleToggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app">
      <header>
        <h1>TaskFlow</h1>
        <p>Manage your tasks easily</p>
      </header>

      <main>
        <div className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat-card">
            <span>Active</span>
            <h2>{activeCount}</h2>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <h2>{completedCount}</h2>
          </div>
        </div>

        <div className="task-header">
          <h2>My Tasks</h2>
        </div>

        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button type="submit">+ Add Task</button>
        </form>

        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
        />

        <div className="filter-buttons">
          <button
            type="button"
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            All ({tasks.length})
          </button>

          <button
            type="button"
            className={filter === "active" ? "selected" : ""}
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </button>

          <button
            type="button"
            className={filter === "completed" ? "selected" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="tasks">
          {filteredTasks.map((task) => (
            <div className="task" key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
              />

              {editingId === task.id ? (
                <form
                  className="edit-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit(task.id);
                  }}
                >
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>

                  <button type="submit">Save</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>

                  <strong className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </strong>

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => {
                        setEditingId(task.id);
                        setEditText(task.title);
                        setEditPriority(task.priority);
                      }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <p className="empty-message">No matching tasks found.</p>
        )}
      </main>
    </div>
  );
}

export default App;