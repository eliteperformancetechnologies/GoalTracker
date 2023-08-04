import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const [tasks, setTasks] = useState(initialTasks);
  const [currentTask, setCurrentTask] = useState("");
  const [reward, setReward] = useState("");
  const [numSteps, setNumSteps] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [victoryBadges, setVictoryBadges] = useState(0);
  const [userName, setUserName] = useState("");
  const [nameInputVisible, setNameInputVisible] = useState(true);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (currentTask && numSteps > 0) {
      setTasks([
        ...tasks,
        {
          task: currentTask,
          steps: [],
          reward,
          numSteps,
          completed: false
        }
      ]);
      setCurrentTask("");
      setReward("");
      setNumSteps(0);
    }
  };

  const handleAddStep = (index, step) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].steps.push(step);
    setTasks(updatedTasks);

    if (updatedTasks[index].steps.length === updatedTasks[index].numSteps) {
      setCompleted([...completed, index]);
    }
  };

  const handleCompleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
    setVictoryBadges(victoryBadges + 1);
  };

  const handleNameInputBlur = () => {
    if (userName.trim() !== "") {
      setNameInputVisible(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Goal Tracker</h1>
        <div className="user-input-container">
          {nameInputVisible ? (
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={handleNameInputBlur}
            />
          ) : (
            <p className="user-welcome">Welcome, {userName}!</p>
          )}
        </div>
        <div className="task-input-container">
          <label htmlFor="task-input">Task:</label>
          <input
            id="task-input"
            type="text"
            placeholder="Enter your task"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
          />
        </div>
        <div className="task-input-container">
          <label htmlFor="num-steps-input">Number of Steps:</label>
          <input
            id="num-steps-input"
            type="number"
            placeholder="Number of steps"
            value={numSteps}
            onChange={(e) => setNumSteps(Number(e.target.value))}
          />
        </div>
        <div className="task-input-container">
          <label htmlFor="reward-input">Reward:</label>
          <input
            id="reward-input"
            type="text"
            placeholder="How will you reward yourself?"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        <div className="task-input-container">
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        <div className="badges">
          <p>Victory Badges Earned: {victoryBadges}</p>
        </div>
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`task ${task.completed ? "completed" : ""}`}
          >
            <h2>{task.task}</h2>
            <p className="task-details">
              Steps: {task.steps.length}/{task.numSteps} | Reward: {task.reward}
            </p>
            <div className="steps-container">
              <input
                id={`step-input-${index}`}
                type="text"
                placeholder="Enter a step"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddStep(index, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="add-step-button"
                onClick={() => {
                  const input = document.querySelector(`#step-input-${index}`);
                  if (input.value.trim() !== "") {
                    handleAddStep(index, input.value);
                    input.value = "";
                  }
                }}
              >
                Add Step
              </button>
              {task.steps.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className={`step ${
                    completed.includes(index) ? "completed" : ""
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            {task.steps.length === task.numSteps && !task.completed && (
              <button onClick={() => handleCompleteTask(index)}>
                Complete Task
              </button>
            )}
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
