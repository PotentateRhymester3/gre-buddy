import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as questions from "./questionTemplates.json";
import * as questionGenerator from "./questionGenerator";
import $ from 'jquery';
import { getQueriesForElement } from '@testing-library/dom';

function App() {
  var [numAnswered, setNumAnswered] = useState(0);
  var [numCorrect, setNumCorrect] =  useState(0);
  var questionBank = []
  var initQuestion = questionGenerator.generateQuantReasoningQuestion()
  var nextQuestion = questionGenerator.generateQuantReasoningQuestion()
  var [currentQuestion, setCurrentQuestion] = useState({initQuestion, nextQuestion})
  return (
    <>
      <QuestionTitle
        type="quantReasoning"
      />
      <ScoreBoard 
      updateNumAnswered={setNumAnswered}
      updateNumCorrect={setNumCorrect}
      numAnswered={numAnswered}
      numCorrect={numCorrect}
      />
      <QuantReasoningQuestion
        updateCurrentQuestion={setCurrentQuestion}
        updateNumAnswered={setNumAnswered}
        updateNumCorrect={setNumCorrect}
        numAnswered={numAnswered}
        numCorrect={numCorrect}
        currentQuestion={currentQuestion}
      />
    </> 
  )
}

function ScoreBoard(props){
  const {updateNumAnswered, updateNumCorrect, numAnswered, numCorrect} = props;
  var percentage = Math.floor((numCorrect / numAnswered) * 100)
  return (
    <>
      <h3>Percentage Correct: {(numAnswered === 0 ? "--" : percentage)}%</h3>
      <button onClick={() => {
        updateNumAnswered(0);
        updateNumCorrect(0);
      }}>Reset</button>
    </>
  )
}

function QuestionTitle({type}){
  switch(type) {
    case "quantReasoning":
      return (
        <div>
          <h1 className="title">Which quantity is greater?</h1>
        </div>
      );
    default:
      return (
        <div>
          <h1>Unable to find question</h1>
        </div>
      )
  }
}

function QuantReasoningQuestion(props){
  const {updateCurrentQuestion, updateNumAnswered, updateNumCorrect, numAnswered, numCorrect, currentQuestion} = props;
  var question = currentQuestion.initQuestion;
  var [questionState, setQuestionState] = useState("Unanswered");
  var [locked, setLocked] = useState(false);
  useEffect( () => {
    if(questionState==="Unanswered"){
      $("#postAnswer").hide();
    }
    if(questionState==="Correct"){
      $("#postAnswer").show();
      $("#postAnswerInfo").text("You are correct!");
    }
    if (questionState==="Incorrect"){
      $("#postAnswer").show();
      $("#postAnswerInfo").text("Wrong answer :(");
    }
  },);
  
  //Lock choice buttons
  useEffect( () => {
  }, [questionState]);

  return (
    <>
      <div>
        <h5>{question.optionalData}</h5>
      </div>
      <div id="quantWrapper">
        <div id="quantA">
          <h5>Quantity A</h5>
          <p>{question.quantA}</p>
        </div>
        <div id="quantB">
          <h5>Quantity B</h5>
          <p>{question.quantB}</p>
        </div>
      </div>

      {question.choices.map(o => (
          <button class="multiChoiceOption" onClick={() => {
            if (!locked) {
              setLocked(true);
              updateNumAnswered(numAnswered + 1);
              if (o.id === question.correctAnswer){
                updateNumCorrect(numCorrect + 1);
                setQuestionState("Correct")
              } 
              else {
                setQuestionState("Incorrect");
              }
            }}}>{o.value}</button>
      ))}
      <div id='postAnswer' hidden>
        <h4 id="postAnswerInfo"></h4>
        <button onClick={() => {
          setLocked(false);
          setQuestionState("Unanswered");
          updateCurrentQuestion(currentQuestion.nextQuestion)
        }}>Next Question</button>
        <button onclick={() => {
          console.log("Question state: " + questionState);
        }}>Log state</button>
      </div>
    </>
  )
}


ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
