import React, { useState } from "react";
import TodoItem from "./TodoItem";
import "./App.css";

function TodoList() {
  const [tasksByDay, setTasksByDay] = useState({
    "2024-10-13": [
      { id: 1, text: "Doctor Appointment", completed: true },
      { id: 2, text: "Meeting at School", completed: false },
    ],
    "2024-10-14": [
      { id: 3, text: "Grocery Shopping", completed: false },
      { id: 4, text: "Gym Workout", completed: true },
    ],
    "2024-10-15": [{ id: 5, text: "Dentist Appointment", completed: false }],
  });

  const [currentDate, setCurrentDate] = useState("2024-10-13");
  const [text, setText] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the popup

  function goToPreviousDay() {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setCurrentDate(previousDate.toISOString().split("T")[0]);
  }

  function goToNextDay() {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate.toISOString().split("T")[0]);
  }

  const tasks = tasksByDay[currentDate] || [];
  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter((task) => task.completed).length;
  const totalUndone = totalTasks - totalCompleted;

  function addTask(text) {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasksByDay((prev) => ({
      ...prev,
      [currentDate]: [...(prev[currentDate] || []), newTask],
    }));
    setText("");
    setIsPopupOpen(false); // Close the popup after adding the task
  }

  function deleteTask(id) {
    setTasksByDay((prev) => ({
      ...prev,
      [currentDate]: prev[currentDate].filter((task) => task.id !== id),
    }));
  }

  function toggleCompleted(id) {
    setTasksByDay((prev) => ({
      ...prev,
      [currentDate]: prev[currentDate].map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      }),
    }));
  }

  return (
    <div className="todo-container">
      <div className="sidebar">
        <h2>{currentDate}</h2>
        <div>
          <p>{totalTasks} tasks</p>
          <p>{totalCompleted} completed</p>
          <p>{totalUndone} undone</p>
        </div>
        <button onClick={() => setIsPopupOpen(true)}>Add Task</button>
      </div>

      <div className="todo-list">
        <h2>Tasks for {currentDate}</h2>
        <div>
          <button onClick={goToPreviousDay}>&lt;</button>
          <button onClick={goToNextDay}>&gt;</button>
        </div>
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
          />
        ))}
      </div>

      {/* Popup for adding tasks */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add a New Task</h3>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Task description"
            />
            <button onClick={() => addTask(text)}>Add</button>
            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
