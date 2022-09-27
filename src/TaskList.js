import React, { useState, useRef, useEffect } from "react";
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import { v4 as uuidv4 } from 'uuid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';

export default function TaskList(props) {
    const { listName, firestore, auth, deleteList, id, color } = props;
    const [editing, setEditing] = useState(false);
    const todoNameRef = useRef();
    const tasksRef = firestore.collection('tasks');
    var query = tasksRef.where('uid', '==', auth.currentUser.uid).where('listName', '==', listName);
    // console.log('first query', useCollectionData(query, { idField: 'id' }));
    // query = query.orderBy('createdAt');
    // console.log('second query', useCollectionData(query, { idField: 'id' }));
    const [tasks] = useCollectionData(query, { idField: 'id' });
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        if (tasks) {
            setTodos(tasks);
        }
    }, [tasks], query);

    const toggleEditing = () => {
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
            uid: auth.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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

    function handleDeleteAll(){
        tasksRef.where('uid', '==', auth.currentUser.uid).where('listName', '==', listName).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
    }

    function handleDeleteList(){
        console.log(`Deleting list with id: ${id}`);
        deleteList(id);
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
    else if (percentComplete >= 25) {
        progressStyle = "bg-warning"
    }
    else {
        progressStyle = "bg-danger"
    }

    const headerStyle = {
        background: color,
    };

    return (
        <div className="col-12 col-md-6">
            <div className="card my-3 mx-3" id={listName}>
                <div className="card-header d-flex justify-content-between flex-wrap" style={headerStyle}>
                    <h3>{listName}</h3>
                    <div className="d-flex">
                        {editing ?
                            <>
                                <button className="btn btn-danger me-2 h-100" onClick={handleDeleteAll}>Delete All</button>
                                <button className="btn btn-danger me-2 h-100" onClick={handleDeleteList}>Delete List</button>
                                <button className="btn btn-primary h-100" onClick={resetTodos}>Reset All</button>
                            </>
                            : null}
                        <button className="btn btn-secondary ms-2" onClick={toggleEditing}>
                            {editing ? "Done" : "Edit"}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <TodoList todos={todos} toggleTodo={toggleTodo} updateTodoName={updateTodoName} handleDeleteTodo={handleDeleteTodo} editing={editing} />
                </div>
                {editing ?
                    <ul className="list-group list-group-flush trans-white">
                        <li className="list-group-item "><AddTodo todoNameRef={todoNameRef} handleAddTodo={handleAddTodo} /></li>
                    </ul>
                    : null}
                <div className="card-footer d-flex">
                    {todos.length > 0 ?
                        <>
                            <span>{todos.filter(todo => !todo.complete).length} tasks left</span>
                            <div className={`progress flex-grow-1 mt-1 ms-3 border border-primary ${percentComplete === '0' ? 'bg-danger' : 'bg-white'} `}>
                                <div className={`progress-bar progress-bar-striped progress-bar-animated ${progressStyle} `} role="progressbar" style={{ width: percentComplete + "%" }}>{percentComplete + "%"}</div>
                            </div>
                        </>
                        : null}
                </div>
            </div>
        </div>
    )
}
