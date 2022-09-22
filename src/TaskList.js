import React, { useState, useRef, useEffect } from "react";
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import { v4 as uuidv4 } from 'uuid';
import schedule from 'node-schedule';

const LOCAL_STORAGE_KEY = 'todoApp'

export default function TaskList({ listName, resetTimer }) {
    const TASK_KEY = `${LOCAL_STORAGE_KEY}.${listName}`;
    const [todos, setTodos] = useState([]);
    const [editing, setEditing] = useState(false);
    const todoNameRef = useRef();

    if (resetTimer) {
        schedule.scheduleJob(resetTimer, () => {
            resetTodos();
        });
    }

    const toggleEditing= () => {
        setEditing(!editing);
    }

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem(TASK_KEY));
        if (storedTodos) setTodos(storedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem(TASK_KEY, JSON.stringify(todos));
    }, [todos]);

    function toggleTodo(id) {
        const newTodos = [...todos];
        const todo = newTodos.find(todo => todo.id === id);
        todo.complete = !todo.complete;
        setTodos(newTodos);
    }

    function updateTodoName(id, newName) {
        const newTodos = [...todos];
        const todo = newTodos.find(todo => todo.id === id);
        todo.name = newName;
        setTodos(newTodos);
    }

    function resetTodos() {
        const newTodos = [...todos];
        newTodos.forEach(todo => todo.complete = false);
        setTodos(newTodos);
    }

    function handleAddTodo(e) {
        const name = todoNameRef.current.value;
        if (name === "") return;
        setTodos((prevTodos) => {
            return [...prevTodos, { id: uuidv4(), name: name, complete: false }];
        });
        todoNameRef.current.value = null;
    }

    function handleDelete() {
        setTodos([]);
    }

    function handleDeleteTodo(id) {
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
    }

    var percentComplete = (Math.round(todos.filter(todo => todo.complete).length / todos.length * 100));
    console.log(percentComplete);
    if (isNaN(percentComplete)) {
        percentComplete = "0";
    }
    var progressStyle = '';

    if (percentComplete === 100) {
        progressStyle = "bg-success"
    } 
    else if (percentComplete >= 75) {
        progressStyle = "bg-primary"
    } 
    else if (percentComplete >= 50) {
        progressStyle = "bg-info"
    }
    else if (percentComplete >= 25){
        progressStyle = "bg-warning"
    }
    else {
        progressStyle = "bg-danger"
    }

    return (
        <div className="card my-3 w-100 mx-3">
            <div className="card-header d-flex justify-content-between">
                <h3>{listName}</h3>
                <div className="d-flex">
                    {editing ? 
                    <div>
                        <button className="btn btn-danger me-2 h-100" onClick={handleDelete}>Delete ALL</button> 
                        <button className="btn btn-primary h-100" onClick={resetTodos}>Reset All</button>
                    </div>
                    : null}
                    <button className="btn btn-secondary ms-2" onClick={toggleEditing}>
                        {editing ? "Done" : "Edit"}
                    </button>
                </div>
            </div>
            <div className="card-body">
                <TodoList todos={todos} toggleTodo={toggleTodo} updateTodoName={updateTodoName} handleDeleteTodo={handleDeleteTodo} editing={editing}/>
            </div>
            {editing ? 
            <ul className="list-group list-group-flush trans-white">
                <li className="list-group-item "><AddTodo todoNameRef={todoNameRef} handleAddTodo={handleAddTodo} /></li>
            </ul>
            : null }
            <div className="card-footer d-flex">
                <span>{todos.filter(todo => !todo.complete).length} tasks left</span>
                <div className={`progress flex-grow-1 mt-1 ms-3 border border-primary ${percentComplete === '0' ? 'bg-danger' : 'bg-white'} `}>
                    <div className={`progress-bar progress-bar-striped progress-bar-animated ${progressStyle} `} role="progressbar" style={{ width: percentComplete + "%" }}>{percentComplete + "%"}</div>
                </div>
            </div>
        </div>
    )
}
