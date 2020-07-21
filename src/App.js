import React, { Component } from 'react';
import axios from "axios";
import './App.css';

import CanvasJSReact from './canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="title">
					<h1>Opinions</h1>
				</div>
				<div className="main">
					<Survey></Survey>
				</div>
			</div>
		);
	}
}

class Survey extends Component {
	state = {
		data: [],
		voted: false,
		questionIndex: 0,
		lastQuestion: false
	};

	componentDidMount() {
		axios.defaults.headers.common = {
			"Content-Type": "application/json"
		}

		axios.get("/data").then((response) => {
			this.setState({ data: response.data });
		});
	}

	clicked = (optionIndex) => {
		const { data } = this.state;
		data[this.state.questionIndex]["results"][optionIndex]++;
		this.setState({ data: data });
		//console.log(this.state);
		console.log("option " + optionIndex + " clicked");

		let userInfo = {
			question: this.state.questionIndex,
			choice: optionIndex
		}

		// post results
		axios.post("/data", userInfo);

		this.setState({ voted: true });
	}

	nextQuestion = () => {
		console.log("next question")
		const { data } = this.state;
		if (this.state.questionIndex < data.length - 1) {
			if (this.state.questionIndex == data.length -2) {
				this.setState({ lastQuestion: true });
			}

			this.setState({ voted: false });
			let index = this.state.questionIndex;
			this.setState({ questionIndex: index + 1 });
			this.render();
		}
	}

	getVotes = (optionIndex) => {
		const { data } = this.state;
		var results = data[this.state.questionIndex]["results"];

		return results[optionIndex];
	}

	getPercentage = (optionIndex) => {
		const { data } = this.state;
		var results = data[this.state.questionIndex]["results"];

		var votes = 0;
		for (let i = 0; i < results.length; i++) {
			votes += results[i];
		}

		if (votes == 0) {
			return 0;
		}

		return (parseFloat(results[optionIndex]) / parseFloat(votes) * 100).toFixed(0)
	}

	render() {
		const { data } = this.state;

		if (data.length == 0) {
			return (
				<div className="survey"></div>
			);
		}

		let questionOptions = data[this.state.questionIndex]["options"];

		const options = {
			backgroundColor: null,
			data: [{
				type: "pie",
				startAngle: 0,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: [
					{ label: questionOptions[0]["name"], y: this.getPercentage(0), indexLabelFontColor: "white", showInLegend: false },
					{ label: questionOptions[1]["name"], y: this.getPercentage(1), indexLabelFontColor: "white", showInLegend: false }
				]
			}]
		}

		return (
			<>
				{!this.state.voted ? (
					<div className="survey">
						<SurveyOption optionIndex={0} image={questionOptions[0]["image"]} onClick={() => this.clicked(0)}></SurveyOption>
						<SurveyOption optionIndex={1} image={questionOptions[1]["image"]} onClick={() => this.clicked(1)}></SurveyOption>
					</div>
				) : (
					<>
						<CanvasJSChart options={options} />
						<div class="results">
							{!this.state.lastQuestion ? (
								<button onClick={() => this.nextQuestion()}>Next/Prochain</button>
							) : (
								<p>Thank You! Merci!</p>
							)}
						</div>
					</>
					)}
			</>
		);
	}
}

class SurveyOption extends Component {
	render() {
		return (
			<div className="option" onClick={this.props.onClick}>
				<img className="optionImage" src={this.props.image}></img>
			</div>
		);
	}
}

export default App;
