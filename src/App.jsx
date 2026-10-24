
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
      {
        id: 3,
        title: "Create first component",
        priority: "Low",
        completed: true,
      },
    ];
  });

  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save tasks:", error);
    }
  }, [tasks]);

  // Add a new task
  function handleAddTask(e) {
    e.preventDefault();

    if (!newTask.trim()) return;

    const newTaskItem = {
      id: Date.now(),
      title: newTask.trim(),
      priority: newPriority,
      dueDate: newDueDate,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTaskItem]);

    setNewTask("");
    setNewPriority("Medium");
    setNewDueDate("");
  }

  // Delete a task
  function handleDeleteTask(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  }

  // Save edited task
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

  // Cancel editing
  function handleCancelEdit() {
    setEditingId(null);
    setEditText("");
    setEditPriority("Medium");
  }

  // Mark task completed or active
  function handleToggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Task statistics
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  // Search and filter tasks
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

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return (
        (priorityOrder[a.priority] ?? 4) -
        (priorityOrder[b.priority] ?? 4)
      );
    }

    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    }

    return 0;
  });

  // Today's date in local time
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="app">
      <header>
        <h1>TaskFlow</h1>
        <p>Manage your tasks easily</p>
      </header>

      <main>
        {/* Statistics */}
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

        {/* Add task form */}
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
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

          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />

          <button type="submit">+ Add Task</button>
        </form>

        {/* Search */}
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
        />

        
          {/* Task Controls */}
          <div className="task-controls">
            {/* Sorting */}
            <div className="sort-controls">
              <label htmlFor="sortTasks">Sort by:</label>

              <select
                id="sortTasks"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>

            {/* Filters */}
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
          </div>


            {/* Task list */}
            <div className="tasks">
              {sortedTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">✓</div>
                  <h3>No tasks found</h3>
                  <p>
                    Try a different search or filter, or add a new task
                    to get started.
                  </p>
                </div>
              ) : (
                sortedTasks.map((task) => (
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
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <span className={task.completed ? "completed" : ""}>
                          {task.title}
                        </span>

                        {task.dueDate && (
                          <small className="due-date">
                            Due: {task.dueDate}
                          </small>
                        )}

                        {task.dueDate &&
                          !task.completed &&
                          task.dueDate < todayString && (
                            <strong className="overdue">Overdue</strong>
                          )}

                        <strong
                          className={`priority ${(task.priority || "Medium").toLowerCase()}`}
                        >
                          {task.priority || "Medium"}
                        </strong>

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => {
                            setEditingId(task.id);
                            setEditText(task.title);
                            setEditPriority(task.priority || "Medium");
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
                ))
              )}
            </div>


        {filteredTasks.length === 0 && (
          <p className="empty-message">No matching tasks found.</p>
        )}
      </main>
    </div>
  );
}

export default App;
