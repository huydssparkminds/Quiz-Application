"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const titleQuestion = document.getElementById("titleQuestion");
const quizMainAnswerElement = document.querySelector(".quiz-main__answer");
const btnSubmit = document.getElementById("btnSubmit");
const currentQuestNumber = document.getElementById("currentQuestNumber");
const progress = document.getElementById("quiz-header__progress-bar");
let score = 0;
let currenIndexQuestion = 0;
let totalQuestionsCount = 0;
let Questions = [];
let myAnswer = "";
let currentQuestion = {
    id: 0,
    question: "",
    choices: [],
    correct_answer: "",
};
const setlocalStorage = (obj) => {
    const myObjectJSON = JSON.stringify(obj);
    localStorage.setItem("question", myObjectJSON);
};
function loadQuestion() {
    return __awaiter(this, void 0, void 0, function* () {
        const APIUrl = "http://localhost:3000/quiz";
        const result = yield fetch(`${APIUrl}`);
        const data = yield result.json();
        Questions = data;
        totalQuestionsCount = Questions.length;
        showQuestion(data);
    });
}
const showQuestion = (data) => {
    currentQuestion = data[currenIndexQuestion];
    titleQuestion.innerText = currentQuestion.question;
    let optionsList = currentQuestion.choices;
    currentQuestNumber.innerText = `${currenIndexQuestion + 1}/${totalQuestionsCount}`;
    const progressWidth = ((currenIndexQuestion + 1) / Questions.length) * 100;
    progress.style.width = `${progressWidth}%`;
    quizMainAnswerElement.innerHTML = `${optionsList
        .map((option, index) => `
    <div class="quiz-main__answer__option" data-number=${index} >
      <span class="quiz-main__answer__option--title">${option}</span>
    </div>
    `)
        .join("")}`;
    selectOption();
};
// hàm chọn đáp án
const selectOption = () => {
    const divAns = document.querySelectorAll(".quiz-main__answer__option");
    divAns.forEach((option, index) => {
        option.addEventListener("click", () => {
            divAns.forEach((opt) => opt.classList.remove("option--active"));
            divAns[index].classList.add("option--active");
            myAnswer = index;
        });
    });
};
let hasSubmitted = false;
// hàm check đáp án
const checkAnswer = () => {
    btnSubmit === null || btnSubmit === void 0 ? void 0 : btnSubmit.addEventListener("click", () => {
        if (!hasSubmitted) {
            if (myAnswer === "") {
                alert("Bạn Chưa Chọn Đáp Án");
            }
            else {
                // lưu index câu hỏi vào local
                let obj = {
                    currenIndex: currenIndexQuestion,
                    userScore: score,
                };
                setlocalStorage(obj);
                const isCorrect = currentQuestion.correct_answer === myAnswer;
                document
                    .querySelectorAll(".quiz-main__answer__option")
                    .forEach((option, index) => {
                    if (index === currentQuestion.correct_answer) {
                        option.classList.add("correct");
                    }
                });
                if (isCorrect)
                    score++;
                hasSubmitted = true;
                myAnswer = "";
            }
        }
        else {
            nextQuestion();
            hasSubmitted = false;
        }
    });
};
// hàm chuyển bài
const nextQuestion = () => {
    currenIndexQuestion++;
    if (currenIndexQuestion < Questions.length) {
        showQuestion(Questions);
    }
    else {
        showResult();
    }
};
// hàm show kêt quả
const showResult = () => {
    const resultModalElement = document.getElementById("resultModal");
    if (resultModalElement) {
        resultModalElement.classList.add("show");
        resultModalElement.style.display = "block";
        const myScore = document.getElementById("scoreDisplay");
        const numberCorrect = document.getElementById("correctDisplay");
        myScore.innerText = String(((100 / Questions.length) * score).toFixed(1));
        numberCorrect.innerText = `${score} / ${Questions.length}`;
        const closeButton = document.getElementById("closeModalButton");
        if (closeButton) {
            closeButton.addEventListener("click", () => {
                resultModalElement.classList.remove("show");
                resultModalElement.style.display = "none";
                restartQuiz();
            });
        }
    }
};
// hàm khởi tạo lại bài
const restartQuiz = () => {
    localStorage.removeItem("question");
    currenIndexQuestion = 0;
    score = 0;
    loadQuestion();
};
const getLocalData = () => {
    const dt = !!localStorage.getItem("question")
        ? localStorage.getItem("question")
        : null;
    if (dt) {
        const localData = JSON.parse(dt);
        if (localData) {
            currenIndexQuestion = localData.currenIndex;
            score = localData.userScore;
            showQuestion(Questions);
        }
    }
};
document.addEventListener("DOMContentLoaded", getLocalData);
document.addEventListener("DOMContentLoaded", function () {
    loadQuestion();
    checkAnswer();
});
