import React from "react";
import TaskList from "./TaskList";
import Background from "./Background";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import schedule from "node-schedule";

function App() {
	const daily = new schedule.RecurrenceRule();
	daily.hour = 0;
	const weekly = new schedule.RecurrenceRule();
	weekly.dayOfWeek = 0;
	const monthly = new schedule.RecurrenceRule();
	monthly.date = 1;

	return (
		<div id="main-content">
			<Background />
			<div className="spacer-1">
			</div>
			<div className="container d-flex justify-content-center flex-row flex-wrap">
				<TaskList listName="Daily Habits" resetTimer={daily}/>
				<TaskList listName="Weekly Habits" resetTimer={weekly}/>
				<TaskList listName="Monthly Habits" resetTimer={monthly}/>
			</div>
		</div>
	);
}

export default App;
