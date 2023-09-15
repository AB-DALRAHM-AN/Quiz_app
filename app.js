let qBody = document.querySelector(".quiz-body");
let Question = document.querySelector(".quiz-body h2");
let footer = document.querySelector("quiz-footer");
let next = document.querySelector(".btn");
let timer = document.querySelector(".timer");
let secTimer = document.querySelector(".timer_sec");

let current = 0;
let rAns = 0;
let countInterval;

// the first function to get the questions from json file and add it to the body of the page
function getQuestions() {
  // crate a request
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", "quistions.json", true);
  myRequest.send();
  // check if the request is done and the status is 200
  myRequest.onreadystatechange = () => {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      let qObject = JSON.parse(myRequest.responseText);
      let qCount = qObject.length;
      count(10, qCount);
      // the second function is addQuestion function to add the question to the body
      addQuestion(qObject[current], qCount);
      // event that when I click on the next button the current will increment by one
      next.addEventListener("click", () => {
        let rightAnswers = qObject[current].right_answer;
        current++;
        // the third function is rightAnswer function to check if the answer is right or not
        rightAnswer(rightAnswers, qCount);
        // remove the old question
        qBody.innerHTML = "";
        Question.innerHTML = "";
        // add the new question
        addQuestion(qObject[current], qCount);
        // the forth function is showResult function to show the result at the end of the quiz
        showResult(qCount);
        // the fifth function is the counter function to start the timer
        clearInterval(countInterval);
        count(10, qCount);
      });
    }
  };
}
// call the first function
getQuestions();

// addQuestion function
function addQuestion(qObject, qCount) {
  // this statement to check if the current is less than the number of questions to not make an error when the questions finish
  if (current < qCount) {
    // create the question and add it to body
    let qText = document.createTextNode(qObject["title"]);
    Question.className = "question";
    Question.appendChild(qText);
    qBody.appendChild(Question);
    // create the answers and add it to body
    for (let i = 1; i <= 4; i++) {
      let answersDiv = document.createElement("div");
      answersDiv.className = "answers";
      let answerInput = document.createElement("input");
      answerInput.id = `answer_${i}`;
      answerInput.type = "radio";
      answerInput.name = "answer";
      answerInput.dataset.answer = qObject[`answer_${i}`];
      let answer = document.createElement("label");
      answer.htmlFor = `answer_${i}`;
      answer.id = "answer";
      let answerText = document.createTextNode(qObject[`answer_${i}`]);
      answer.appendChild(answerText);
      answersDiv.appendChild(answerInput);
      answersDiv.appendChild(answer);
      qBody.appendChild(answersDiv);
    }
  }
}

// rightAnswer function
function rightAnswer(correctAnswer, qCount) {
  let answers = document.getElementsByName("answer");
  let chosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (chosenAnswer === correctAnswer) {
    rAns++;
  }
  if (current === qCount - 1) {
    showResult(qCount);
  }
}

function showResult(qCount) {
  let result;
  // check if the current is equal to the number of questions to show the result at the end of the quiz
  if (current === qCount) {
    qBody.innerHTML = "";
    Question.innerHTML = "";
    timer.innerHTML = "";
    next.style.display = "none";
    if (rAns === qCount) {
      result = document.createTextNode(
        `You are a genius, you got ${rAns} out of ${qCount}`
      );
    } else if (rAns < qCount && rAns > 0) {
      result = document.createTextNode(
        `You are normal, you got ${rAns} out of ${qCount}`
      );
    } else {
      result = document.createTextNode(
        `You didn't get any answers right, better luck next time!`
      );
    }
    Question.appendChild(result);
    qBody.appendChild(Question);
  }
}

// count function
function count(duration, count) {
  // this statement to check if the current is less than the number of questions to not make an error when the questions finish
  if (current < count) {
    let sec = duration;
    countInterval = setInterval(() => {
      sec--;
      secTimer.innerHTML = sec;
      if (sec === 0) {
        clearInterval(countInterval);
        next.click();
      }
    }, 1000);
  }
}
