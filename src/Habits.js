import React, { useState, useRef, useEffect } from "react";
import TaskList from './TaskList';
import SignOut from './SignOut';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import { v4 as uuidv4 } from 'uuid';

export default function Habits(props) {
    const { auth, firestore } = props;
    const listRef = firestore.collection('lists');
    const [lists, setLists] = useState([]);
    const listNameRef = useRef();
    const colorRef = useRef();
    const query = listRef.where('uid', '==', auth.currentUser.uid);
    const [listNames] = useCollectionData(query, { idField: 'id' });

    useEffect(() => {
        if (listNames) {
            setLists(listNames);
        }
    }, [listNames]);

    function createList(listName, color) {
        const id = uuidv4();
        listRef.doc(id).set({
            name: listName,
            uid: auth.currentUser.uid,
            color: color,
            id: id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(() => {
            console.log("Document written with ID: ", id);
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    function deleteList(id) {
        listRef.doc(id).delete().then(() => {
            console.log(`Document ${id} successfully deleted!`);
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <div id="habits">
            <nav className="navbar navbar-dark bg-primary">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">Habits</span>
                    <span className='d-flex align-items-center'>
                        <img src={auth.currentUser.photoURL} alt='profile' className='rounded-circle me-2 my-auto' width={30}></img>
                        <h3 className='text-center my-auto'>{auth.currentUser.displayName}</h3>
                    </span>
                    <SignOut auth={auth} />
                </div>
            </nav>
            <div className="container d-flex justify-content-center flex-row flex-wrap">
                {lists.map((list) => {
                    return <TaskList listName={list.name} firestore={firestore} auth={auth} key={list.id} deleteList={deleteList} id={list.id} color={list.color} />
                })}
                <div className='col-12 col-md-6'>
                    <div className='card my-3 mx-3'>
                        <div className='card-header'>
                            <h3 className='text-center'>Create New List</h3>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={(e) => {
                                createList(listNameRef.current.value, colorRef.current.value); 
                                e.preventDefault();
                                }}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="listname">List Name</span>
                                    <input type="text" className="form-control" placeholder="Enter your list name here" ref={listNameRef}/>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="form-label input-group-text">Color</span>
                                    <input type="color" className="form-control form-control-color" id="colorpicker" defaultValue="#563d7c" title="Choose your color" ref={colorRef}/>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
