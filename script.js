let currentQuestionIndex = 0;
let score = 0;
const questions = [];
const wrongQuestions = [];

const questionContainer = document.getElementById('question-container');
const questionTextElement = document.getElementById('question-text');
const optionsListElement = document.getElementById('options-list');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const wrongQuestionsList = document.getElementById('wrong-questions');
const correctAnswersList = document.getElementById('correct-answers');
const questionCountInput = document.getElementById('question-count');
const startQuizButton = document.getElementById('start-quiz');

startQuizButton.addEventListener('click', () => {
    const selectedQuestionCount = parseInt(questionCountInput.value, 10);
    if (selectedQuestionCount > 0 && selectedQuestionCount <= questions.length) {
        // Potong array pertanyaan berdasarkan jumlah yang dipilih oleh pengguna
        questions.splice(selectedQuestionCount);
        displayQuestion();
        questionContainer.style.display = 'block';
        startQuizButton.style.display = 'none';
        questionCountInput.style.display = 'none';
        document.getElementById('length-soal').innerHTML = questionCountInput.value;
    } else {
        alert('Masukkan jumlah soal yang valid.');
    }
});

async function fetchData() {
    try {
        const response = await fetch('./data.json'); // Gantilah dengan URL atau path file JSON yang sesuai
        const data = await response.json();
        // Acak urutan pertanyaan
        shuffleArray(data);
        questions.push(...data); // Menambahkan semua pertanyaan ke array questions
        document.getElementById('length').innerHTML = questions.length;
        questionCountInput.value = questions.length;
    } catch (error) {
        console.error(error);
    }
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionTextElement.textContent = currentQuestion.question;

        // Mengacak urutan opsi jawaban
        const shuffledOptions = [...currentQuestion.options];
        shuffleArray(shuffledOptions);

        optionsListElement.innerHTML = '';

        shuffledOptions.forEach((option, index) => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => checkAnswer(option, currentQuestion.answer));
            optionsListElement.appendChild(li);
        });
    } else {
        showResult();
    }
}


function checkAnswer(selectedOption, correctAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === correctAnswer) {
        score++;
    } else {
        wrongQuestions.push(currentQuestion);
        currentQuestion.correctAnswer = correctAnswer;
    }
    currentQuestionIndex++;
    displayQuestion();
}

function showResult() {
    questionTextElement.style.display = 'none';
    optionsListElement.style.display = 'none';
    nextButton.style.display = 'none';

    // Menampilkan hasil ujian
    resultContainer.style.display = 'block';
    scoreElement.textContent = `Skor Anda: ${score}/${questions.length}`;

    // Tambahkan elemen untuk daftar pertanyaan dan jawaban
    const questionsAndAnswersContainer = document.createElement('div');

    // Menampilkan pertanyaan yang salah dan jawabannya
    if (wrongQuestions.length > 0) {
        const wrongQuestionsHTML = wrongQuestions.map((wrongQuestion, index) => {
            return `<li>${index + 1}. Pertanyaan: ${wrongQuestion.question}, Jawaban yang Benar: ${wrongQuestion.correctAnswer}</li>`;
        }).join('');
        questionsAndAnswersContainer.innerHTML = `
            <h3>Pertanyaan yang Salah dan Jawaban yang Benar:</h3>
            <ul>${wrongQuestionsHTML}</ul>
        `;
    } else {
        questionsAndAnswersContainer.innerHTML = 'Tidak ada jawaban yang salah.';
    }

    // Tambahkan elemen daftar pertanyaan dan jawaban ke resultContainer
    resultContainer.appendChild(questionsAndAnswersContainer);
}


// Fungsi untuk mengacak urutan array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

fetchData();
