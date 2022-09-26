import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Habits from "./Habits";
import './background.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';


firebase.initializeApp({
	apiKey: "AIzaSyD66DRh5uDb65RNfrinoxfo5jd4q_AIUZI",
	authDomain: "task-1d1a9.firebaseapp.com",
	projectId: "task-1d1a9",
	storageBucket: "task-1d1a9.appspot.com",
	messagingSenderId: "662444075659",
	appId: "1:662444075659:web:0c633b9452cb8227ad428e",
	measurementId: "G-YTPE5QQSQ2"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
	const [user] = useAuthState(auth);
	return (
		<div id="main-content">
			<div className="area" >
				<ul className="circles">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div >
			{user ? <Habits auth={auth} firestore={firestore} /> : <SignIn />}
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	}
	return (
		<div id="sign-in">
			<nav className="navbar navbar-dark bg-primary">
				<div className="container-fluid">
					<span className="navbar-brand mb-0 h1">Habits</span>
				</div>
			</nav>
			<div className="d-flex justify-content-center flex-column align-items-center flex-grow-1">
				<div className="card col-6">
					<div className="card-header">
						<h1 className="text-center">Start Tracking Your Habits</h1>
					</div>
					<div className="card-body text-center">
						<p className="card-text">Sign in to continue.</p>
						<button className="btn btn-primary" onClick={signInWithGoogle}><img src='https://unifysolutions.net/supportedproduct/google-signin/Google__G__Logo.svg' width="30" height="30" alt='Google G Logo'></img> Sign In With Google</button>
					</div>
				</div>
			</div>

		</div>
	)
}

export default App;
