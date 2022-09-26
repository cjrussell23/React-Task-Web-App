import React from 'react'
import TaskList from './TaskList';
import SignOut from './SignOut';

export default function Habits(props) {
    const { auth, firestore } = props;

    return (
        <div id="habits">
            <nav className="navbar navbar-dark bg-primary">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">Habits</span>
                    <SignOut auth={auth} />
                </div>
            </nav>
            <div className="container d-flex justify-content-center flex-row flex-wrap">
                <TaskList listName="Daily Habits" firestore={firestore} auth={auth} />
                <TaskList listName="Weekly Habits" firestore={firestore} auth={auth} />
                <TaskList listName="Monthly Habits" firestore={firestore} auth={auth} />
            </div>
        </div>
    );
}
