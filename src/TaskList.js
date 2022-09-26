import React, { useState, useRef, useEffect } from "react";
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import { v4 as uuidv4 } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function TaskList(props) {
    const { listName, firestore, auth } = props;
    const [editing, setEditing] = useState(false);
    const todoNameRef = useRef();
    const tasksRef = firestore.collection('tasks');
    const query = tasksRef.where('uid', '==', auth.currentUser.uid).where('listName', '==', listName);
    const [tasks] = useCollectionData(query, { idField: 'id' });
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        if (tasks) {
            setTodos(tasks);
        }
    }, [tasks]);

    const toggleEditing= () => {
        setEditing(!editing);
    }

    function toggleTodo(id) {
        const complete = todos.find(todo => todo.id === id).complete;
        tasksRef.doc(id).update({
            complete: !complete,
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    function resetTodos() {
        // Set completed on all todos to false
        tasksRef.where('uid', '==', auth.currentUser.uid).where('listName', '==', listName).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    complete: false
                })
            });
        });
    }

    function updateTodoName(id, newName) {
        tasksRef.doc(id).update({
            name: newName,
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    function handleAddTodo() {
        const name = todoNameRef.current.value;
        const id = uuidv4();
        tasksRef.doc(id).set({
            id: id,
            name: name,
            complete: false,
            listName: listName,
            uid: auth.currentUser.uid
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        todoNameRef.current.value = null;
    }

    function handleDeleteTodo(id) {
        console.log(`Deleting todo with id: ${id}`);
        tasksRef.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    function handleDeleteAll() {
        console.log(`Deleting all todos`);
        tasksRef.where('uid', '==', auth.currentUser.uid).where('listName', '==', listName).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
    }

    var percentComplete = (Math.round(todos.filter(todo => todo.complete).length / todos.length * 100));
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
        <div className="card my-3 w-100 mx-3" id={listName}>
            <div className="card-header d-flex justify-content-between">
                <h3>{listName}</h3>
                <div className="d-flex">
                    {editing ? 
                    <div>
                        <button className="btn btn-danger me-2 h-100" onClick={handleDeleteAll}>Delete ALL</button> 
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
