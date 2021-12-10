import * as templates from "./templates.json";

export function generateQuantReasoningQuestion() {
    //select random quantReasoning template
    let template = templates.quantReasoning[getRandomInt(0,3)];

    //get value table 
    let variableTable = getVariableValues(template.variableValues);
    console.log(Object.values(variableTable));
    
    //inject values into string
    let newOptionalData = injectValues(variableTable, template.optionalData);
    let newQuantA = injectValues(variableTable, template.quantA);
    let newQuantB = injectValues(variableTable, template.quantB);
    // let solvedCorrectAnswer = getAnswer(template.correctAnswer, template.valueA, template.valueB);
    return {
        optionalData: newOptionalData,
        quantA: newQuantA,
        quantB: newQuantB,
        choices: [
            {id:"a", value:"A is greater"},
            {id:"b", value:"B is greater"},
            {id:"c", value:"The two quantities are equal"},
            {id:"d", value:"The relationship cannot be determined from the information given"}
          ],
        correctAnswer: template.correctAnswer
        // correctAnswer: solvedCorrectAnswer

    };
}

//helper functions

function injectValues(valuesArray, text) {
    let textSplit = text.split(" ");
    textSplit.forEach(function(word, index, array) {
            if (word[0] === "~"){
                array[index] = handleEmbeddedExpression(word, valuesArray);
            }
            if (word[0] === "&"){
                console.log("insertValues() called for :" + word[0]);
                array[index] = valuesArray[word[1]];
            }
        });
    return textSplit.join(' ');
}

function handleEmbeddedExpression(expression, valueTable){
    let expressionSplit = expression.split(",");
    let v1 = parseInt(getTableValue(expressionSplit[1], valueTable));
    let v2 = 0;
    (expressionSplit[3][0] === "&") ? v2 = parseInt(getTableValue(expressionSplit[3], valueTable)) : v2 = parseInt(expressionSplit[3]);
    switch (expressionSplit[2]){
        case "/":
            return v1 / v2;
        case "*":
            return v1 * v2;
        case "-":
            return v1 - v2;
        case "+":
            return v1 + v2;
        default:
            return "EXPRESSION ERROR";
    }
}

function getVariableValues(variableObject){
    let resultValues = [];
    let inputValues = Object.values(variableObject);
    console.log("input values: ", inputValues);
    inputValues.forEach(variable => {
        console.log("variable type: " + typeof variable)
        resultValues.push(parseVariableValue(variable));
    })
    return resultValues;
}

function getTableValue(input, valueTable){
    return valueTable[input[1]];
}

function parseVariableValue(valueString){
    console.log("parseVariableValue() valueString: ", valueString);
    let returnValue = "";
    let objectSplit = valueString.split(";");
    console.log("parseVariableValue() objectSplit: ", objectSplit);

    if (objectSplit[0] == "rand+") {
        let min = parseInt(objectSplit[1])
        let max = parseInt(objectSplit[2])
        returnValue = getRandomInt(min, max);
        console.log("parseVariableValue() randomeNumber:", returnValue)
    }
    if (objectSplit.includes("*")) {
        returnValue *= parseInt(objectSplit[objectSplit.indexOf("*") + 1])
    }
    if (objectSplit.includes("+")) {
        returnValue += parseInt(objectSplit[objectSplit.indexOf("+") + 1])
    }
    return returnValue.toString();
}

function getAnswer(jsonAnswer, valueA, valueB) {
    if (jsonAnswer === "not yet known") {

    }
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}