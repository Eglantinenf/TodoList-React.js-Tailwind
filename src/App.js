import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    return savedTodos || [];
  });
  const [taskInput, setTaskInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [isSortEnabled, setIsSortEnabled] = useState(false);
  const [deletedTask, setDeletedTask] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTask() {
    if (taskInput.trim() === "") return;

    const newTask = { title: taskInput, isComplete: false };
    setTodos([...todos, newTask]);
    setTaskInput("");
  }

  function toggleComplete(index) {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  }

  const deleteTask = (index) => {
    const taskToDelete = todos[index];
    setTodos(todos.filter((_, i) => i !== index));

    setDeletedTask(taskToDelete);
    setShowUndo(true);

    setTimeout(() => {
      setShowUndo(false);
      setDeletedTask(null); // Clear deleted task if undo isn't clicked
    }, 3000);
  };

  const undoDelete = () => {
    if (deletedTask) {
      setTodos([...todos, deletedTask]);
      setShowUndo(false);
      setDeletedTask(null);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isComplete;
    if (filter === "incomplete") return !todo.isComplete;
    return true;
  });

  const sortedTodos = isSortEnabled
    ? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
    : filteredTodos;

  return (
    <div className="App bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-lg p-6">
        <Header />
        <InputForm
          taskInput={taskInput}
          setTask={setTaskInput}
          addTask={addTask}
        />
        <FilterButtons
          setFilter={setFilter}
          isSortEnabled={isSortEnabled}
          setIsSortEnabled={setIsSortEnabled}
        />
        <TodoList
          todos={sortedTodos}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
        />
      </div>
      {showUndo && (
        <div>
          <button
            className="bg-pink-400 m-3 p-1.5 rounded-lg"
            onClick={undoDelete}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <h1 className="font-Agu-Display text-pink-400 text-4xl text-center mb-6">
      Todo List
    </h1>
  );
}

function InputForm({ taskInput, setTask, addTask }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="flex justify-center items-center mb-4">
      <input
        type="text"
        className="flex-grow w-1/2 p-3 text-lg rounded-l-md bg-blue-300 text-black placeholder-black focus:outline-none"
        placeholder="Add your task..."
        value={taskInput}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-pink-500 rounded-r-md font-bold py-3.5 px-4 hover:bg-pink-400 transition duration-200"
        onClick={addTask}
      >
        +
      </button>
    </div>
  );
}

function FilterButtons({ setFilter, setIsSortEnabled, isSortEnabled }) {
  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="flex gap-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>
      <button
        className={`px-4 py-2 rounded ${
          isSortEnabled ? "bg-pink-400" : "bg-gray-700"
        }`}
        onClick={() => setIsSortEnabled((prev) => !prev)}
      >
        {isSortEnabled ? "Disable A-Z Sort" : "Enable A-Z Sort"}
      </button>
    </div>
  );
}

function TodoList({ todos, toggleComplete, deleteTask }) {
  return (
    <div>
      {todos.map((todo, i) => (
        <TodoItem
          title={todo.title}
          isComplete={todo.isComplete}
          key={i}
          index={i}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}

function TodoItem({ title, isComplete, toggleComplete, deleteTask, index }) {
  return (
    <div
      className={`bg-pink-500 flex items-center justify-between p-4 my-3 rounded-md shadow-md transition-transform transform ${
        isComplete ? "opacity-70" : ""
      }`}
    >
      <h3
        className={`flex-grow text-lg ${
          isComplete ? "line-through text-gray-600" : "text-gray-200"
        }`}
      >
        {title}
      </h3>
      <button
        onClick={() => toggleComplete(index)}
        className="bg-blue-300 text-gray-800 px-4 py-1 rounded-md hover:bg-blue-200 transition duration-250"
      >
        {isComplete ? "Undo" : "Complete"}
      </button>
      <button
        onClick={() => deleteTask(index)}
        className="bg-gray-700 text-white px-4 py-1 ml-2 rounded-md hover:bg-gray-900 transition duration-250"
      >
        Delete
      </button>
    </div>
  );
}

export default App;
