let qBody = document.querySelector(".quiz-body");
let Question = document.querySelector(".quiz-body h2");
let footer = document.querySelector("quiz-footer");
let nextButton = document.querySelector(".btn");
let timer = document.querySelector(".timer");
let secTimer = document.querySelector(".timer_sec");

let current = 0;
let rAns = 0;
let countInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", "/quistions.json", true);
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // console.log(this.responseText);
      let qObject = JSON.parse(this.responseText);
      // console.log(qObject);
      let qCount = qObject.length;
      // console.log(qCount);
      count(10, qCount);
      
      // the addQuestion function
      addQuestion(qObject[current], qCount);
      nextButton.onclick = () => {
        // get the right answer
        let rightAnswers = qObject[current].right_answer;
        // console.log(rightAnswer); done
        current++;
        rightAnswer(rightAnswers, qCount);
        // remove the old question
        qBody.innerHTML = "";
        Question.innerHTML = "";
        addQuestion(qObject[current], qCount);
        // show result
        showResult(qCount);
        // start timer
        clearInterval(countInterval);
        count(10, qCount);
      };
    }
  };
}

getQuestions();

function addQuestion(qObject, qCount) {
  if (current < qCount) {
    // console.log(qCount);
    // console.log(qObject);
    let qText = document.createTextNode(qObject["title"]);
    // console.log(qText); done
    Question.className = "question";
    Question.appendChild(qText);
    qBody.appendChild(Question);
    // done to add question to body
    // create anwers and add to body
    for (let i = 1; i <= 4; i++) {
      let answersDiv = document.createElement("div");
      answersDiv.className = "answers";
      // create buttons
      let answerI = document.createElement("input");
      answerI.id = `answer_${i}`;
      answerI.type = "radio";
      answerI.name = "answer";
      answerI.dataset.answer = qObject[`answer_${i}`];
      // console.log(answer); done
      // create labels
      let answer = document.createElement("label");
      answer.htmlFor = `answer_${i}`;
      answer.id = "answer";
      let answerText = document.createTextNode(qObject[`answer_${i}`]);
      answer.appendChild(answerText);
      // console.log(answer); done
      // append to div
      answersDiv.appendChild(answerI);
      answersDiv.appendChild(answer);
      // append to body
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
      chosenAnswer = answers[i].dataset.answer; // Retrieve the data-answer attribute
    }
  }
  if (chosenAnswer === correctAnswer) {
    rAns++; // Increment rAns only if the chosen answer is correct
  }
  // Check if this was the last question and show the result
  if (current === qCount - 1) {
    showResult(qCount);
  }
}

function showResult(qCount) {
  let result;
  if (current === qCount) {
    qBody.innerHTML = "";
    Question.innerHTML = "";
    timer.innerHTML = "";
    nextButton.style.display = "none";
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

// ten second timer
function count(duration, count) {
  if (current < count) {
    let sec = duration;
    countInterval = setInterval(() => {
      sec--;
      secTimer.innerHTML = sec;
      if (sec === 0) {
        clearInterval(countInterval);
        nextButton.click();
      }
    }, 1000);
  }
}
