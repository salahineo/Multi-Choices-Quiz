/* ------------------------------------------ Selectors ----------------------------------------- */
// Questions Count In Header
let questionsNumberElement = document.querySelector('#numberOfQuestions');
// Questions Count In Result
let questionsCountElement = document.querySelector('#countOfQuestions');
// Bullets Container
let bullets = document.querySelector('#bullets');
// Object Properties Counter
let questionIndex = 0;
// Correct Answers Counter
let correctAnswers = 0;
// Quiz Body
let questionBody = document.querySelector('#question');
// Answers Body
let answers = document.querySelector('#answers');
// Submit Button
let submit = document.querySelector('#submit');
// Results Container
let results = document.querySelector('#result');
// Result State
let resultState = document.querySelector('#state');
// Answered Span
let answered = document.querySelector('#answered');
// Countdown Variable
let countDown;
// Timing Spans
let minutesSpan = document.querySelector('#minutes');
let secondsSpan = document.querySelector('#seconds');

/* ------------------------------------------- Request ------------------------------------------ */
// Fetch JSON File Function
function getQuestions() {
  // Assign New Request To Variable
  let newRequest = new XMLHttpRequest();
  // Check Ready State Change
  newRequest.onreadystatechange = function () {
    // Check For Status Code And Ready State Code
    if (this.readyState === 4 && this.status === 200) {
      // Parsing Response To JS Object
      let questionsObj = JSON.parse(this.responseText);
      // Get Questions Number
      let questionsCount = questionsObj.length;
      // Set Number Of Questions Dynamically
      getQuestionCount(questionsCount);
      // Create Bullets
      createBullets(questionsCount);
      // Add Quiz Data
      addQuestionData(questionsObj[questionIndex], questionsCount);
      // Start Count Down
      countdown(10, questionsCount);
      // On Submit
      submit.onclick = function () {
        // Get Correct Answer
        let correctAnswer = questionsObj[questionIndex].correct;
        // Increase Questions Index
        questionIndex++;
        // Check Answer Function
        checkAnswer(correctAnswer, questionsCount);
        // If Not The Last Question
        if (questionIndex < questionsCount) {
          // Empty Data For Next Question
          questionBody.innerHTML = '';
          answers.innerHTML = '';
        }
        // At Last Question
        if (questionIndex === questionsCount - 1) {
          // Change Button Text
          submit.innerHTML = 'Submit & Show Result';
        }
        // Add Next Question
        addQuestionData(questionsObj[questionIndex], questionsCount);
        // Handle Bullets
        handleBullets();
        // Start Countdown Over again
        clearInterval(countDown);
        countdown(10, questionsCount);
        // Show Result
        showResult(questionsCount);
      };
    }
  };

  // Request The JSON File
  newRequest.open('GET', 'questions/html.json', true);
  // Send Request
  newRequest.send();
}
getQuestions();

/* ------------------------------------------ Functions ----------------------------------------- */
// Set Number Of Questions In Header And Results
function getQuestionCount(count) {
  questionsNumberElement.innerHTML = count;
  questionsCountElement.innerHTML = count;
}

// Create Bullets Dynamically
function createBullets(count) {
  for (let i = 0; i < count; i++) {
    // Create Bullet
    let bullet = document.createElement('span');
    // Append Span To Container
    bullets.appendChild(bullet);
    // Add Class On To First Span
    if (i === 0) {
      bullet.className = 'done';
    }
  }
}

// Add Questions Data Function
function addQuestionData(obj, count) {
  if (questionIndex < count) {
    // Create Heading
    let question = document.createElement('h2');
    // Create Text Question
    let questionValue = document.createTextNode(obj.question);
    // Append Text To Heading
    question.appendChild(questionValue);
    // Append Heading To Quiz Body
    questionBody.appendChild(question);

    // Create Answers
    for (let i = 1; i <= 4; i++) {
      // Create Answer Div
      let answer = document.createElement('div');
      // Add Class To Answer Div
      answer.className = 'answer';
      // Create Radio Input
      let radioInput = document.createElement('input');
      // Add Attributes To Radio Input
      radioInput.name = 'option';
      radioInput.id = `option${i}`;
      radioInput.type = 'radio';
      radioInput.dataset.answer = obj[`option${i}`];

      // Add First Selected Input
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let label = document.createElement('label');
      // Add For Attribute To Label
      label.htmlFor = `option${i}`;
      // Create Text Node Of Answer
      let labelText = document.createTextNode(obj[`option${i}`]);
      // Append Text To Label
      label.appendChild(labelText);

      // Append Label And Input To Answer Div
      answer.appendChild(radioInput);
      answer.appendChild(label);

      // Append Answer Div To Answers Container
      answers.appendChild(answer);
    }
  } else {
    submit.disabled = true;
  }
}

// Check Answer On Submit
function checkAnswer(ans, count) {
  // Get All Options
  let answers = document.getElementsByName('option');
  let chosenAnswer;
  // Loop To Get The Chosen Answer
  for (let i = 0; i < 4; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  // Compare Correct With Chosen Answer
  if (ans === chosenAnswer) {
    correctAnswers++;
  }
  // Add Correct Answers To Results
  answered.innerHTML = correctAnswers;
  // Add Result State
  if (correctAnswers === count) {
    resultState.innerHTML = 'Perfect';
    resultState.className = 'perfect';
  } else if (correctAnswers >= count / 2) {
    resultState.innerHTML = 'Good';
    resultState.className = 'good';
  } else {
    resultState.innerHTML = 'Bad';
    resultState.className = 'bad';
  }
}

function handleBullets() {
  // Get Bullets
  let bullets = document.querySelectorAll('#bullets span');
  bullets.forEach((span, index) => {
    if (questionIndex === index) {
      span.className = 'done';
    }
  });
}

// Show Results
function showResult(count) {
  if (questionIndex === count) {
    // Show Result
    results.classList.add('show');
  }
}

// Countdown Function
function countdown(time, count) {
  if (questionIndex < count) {
    let minutes, seconds;
    countDown = setInterval(function () {
      // Get Time Minutes And Seconds
      minutes = parseInt(time / 60);
      seconds = parseInt(time % 60);
      // Add Zero If It Is One Number
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      // Print Minutes And Seconds In HTML
      minutesSpan.innerHTML = minutes;
      secondsSpan.innerHTML = seconds;
      // Check If Time Finished
      if (--time < 0) {
        // Clear Interval
        clearInterval(countDown);
        // Submit Current Answer
        submit.click();
      }
    }, 1000);
  }
}
