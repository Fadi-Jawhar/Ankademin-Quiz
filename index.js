import { questions } from './src/questions.js';

// Variabler för quizens tillstånd
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill([]);

// DOM-element som vi använder för att visa och hantera quizet.
const questionContainer = document.querySelector('#questionContainer');
const temaBtn = document.querySelector('#temaBtn');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');
const submitButton = document.querySelector('#submitQuiz');
const restartButton = document.querySelector('#restartQuiz');
const quizContainer = document.querySelector('#quizContainer');
const questionNumber = document.querySelector('#questionNumber');
const resultContainer = document.querySelector('#resultContainer');
const scoreElement = document.querySelector('#score');
const endResults = document.querySelector('#endResults');


// Skapar ett nytt HTML-element som man kan anpassa med text, klass och andra inställningar.
function createElement(tag, className, content = '', attributes = {}) {
    const elem = document.createElement(tag);

    if (className) elem.className = className;
    if (content) elem.innerHTML = content;

    for (const attr in attributes) {
        elem.setAttribute(attr, attributes[attr]);
    }

    return elem;
}

function createInputOption(questionIndex, option, optionIndex, inputType, isChecked, handleChange) {
    const optionWrapper = createElement('div', 'option');
    
    // Skapa input-elementet med dess attribut
    const input = createElement('input', '', '', {
        type: inputType,
        name: `q${questionIndex}`,
        id: `q${questionIndex}-${optionIndex}`
    });
    // Kolla om detta alternativ redan är markerat
    input.checked = isChecked;

    // Lägg till eventhanterare för ändringar
    input.addEventListener('change', handleChange);
    
    // Skapa label och koppla den till input
    const label = createElement('label', '', option, { htmlFor: input.id });
    // Lägg input och label i wrappern  
    optionWrapper.append(input, label);
    label.insertBefore(input, label.firstChild);

    // Returnera det kompletta alternativet
    return optionWrapper;
}

function createQuestionElement(question, questionIndex) {
    // Skapa kortet för frågan
    const questionCard = createElement('div', 'question-card');
    
    // Lägg till frågans rubrik
    const title = createElement('h3', 'question-title', question.question);
    
    // Behållare för alternativen
    const optionsContainer = createElement('div', 'options-container');

    // Gå igenom varje alternativ för frågan
    question.options.forEach((option, optionIndex) => {
        const isChecked = userAnswers[questionIndex].includes(option); // Kolla om svaret redan är valt
        const inputType = question.type === 'checkbox' ? 'checkbox' : 'radio'; // Bestäm input-typ

        // Skapa alternativet med hjälp av helper-funktion
        const optionElement = createInputOption(
            questionIndex,
            option,
            optionIndex,
            inputType,
            isChecked,
            () => handleAnswer(questionIndex) // Skicka index till svarshanteraren
        );

        // Lägg alternativet i behållaren
        optionsContainer.appendChild(optionElement);
    });

    // Lägg till rubrik och alternativ i kortet
    questionCard.append(title, optionsContainer);

    // Returnera det färdiga frågekortet
    return questionCard;
}

function handleAnswer(questionIndex) {
    // Hitta alla inputs för den aktuella frågan
    const inputs = document.querySelectorAll(`input[name="q${questionIndex}"]`);

    // Uppdatera användarens svar för frågan
    userAnswers[questionIndex] = Array.from(inputs)
        .filter(input => input.checked) // Ta bara med de som är markerade
        .map(input => {
            const optionIndex = Number(input.id.split('-')[1]); // Plocka ut alternativets index
            return questions[questionIndex].options[optionIndex]; // Hämta alternativets text
        });

    // Kolla om submit-knappen ska visas
    updateSubmitButton();
}

function updateSubmitButton() {
    // Kolla om alla frågor har minst ett svar
    const allAnswered = userAnswers.every(answer => answer.length > 0);

    // Visa eller göm submit-knappen beroende på om alla frågor är besvarade
    submitButton.classList.toggle('hidden', !allAnswered);
}

function updateNavigationButtons(index) {

    // Uppdatera texten som visar vilken fråga man är på
    questionNumber.textContent = `Fråga ${index + 1} av ${questions.length}`;

    // Stäng av bakåtknappen om man är på första frågan
    prevButton.disabled = index === 0;

    // Stäng av framåtknappen om man är på sista frågan
    nextButton.disabled = index === questions.length - 1;
}

function showQuestion(index) {
    // Rensa innehållet från frågebehållaren innan den nya frågan läggs till
    questionContainer.innerHTML = '';

    // Lägg till den nya frågan i behållaren
    questionContainer.appendChild(createQuestionElement(questions[index], index));

    // Uppdatera navigeringsknapparna så att de reflekterar den aktuella frågan
    updateNavigationButtons(index);    

    // Sätt den nuvarande frågeindexen till det som just valts
    currentQuestionIndex = index;
}




function calculateScore() {
    // Loopar igenom alla frågor och kollar om användarens svar är rätt
    return questions.reduce((accumulator, question, index) => {
        // Kollar om användarens svar matchar det rätta svaret
        const isCorrect = arraysEqual(userAnswers[index], question.correctAnswer);

        // Om svaret är rätt, lägg till en poäng
        if (isCorrect) accumulator.score++;

        // Lägg till resultatet för denna fråga, oavsett rätt eller fel
        accumulator.results.push({ ...question, isCorrect, userAnswer: userAnswers[index] });

        return accumulator;
    }, { score: 0, results: [] });
}

function arraysEqual(userAnswer, correctAnswer) {
    // Kollar om längderna på de två svaren är samma och att varje element är lika
    return userAnswer.length === correctAnswer.length && 
        userAnswer.sort().every((value, index) => value === correctAnswer.sort()[index]);
}

function showResults({ score, results }) {
    // Dölj quizet och visa resultatet för användaren
    quizContainer.style.display = 'none';
    resultContainer.classList.remove('hidden');

    // Beräkna procenten för poängen och bestäm resultatets klass
    const percentage = (score / questions.length) * 100;
    const resultClass = percentage < 50 ? 'fail' : percentage <= 75 ? 'warning' : 'success';
    const resultText = percentage < 50 ? 'Underkänt' : percentage <= 75 ? 'Bra jobbat' : 'Riktigt bra jobbat';

    // Visa resultatet med poäng och rätt text beroende på resultatet
    scoreElement.innerHTML = `
        <div class="result-card ${resultClass}">
            <h3>${resultText}</h3>
            <p>Du fick ${score} rätt av ${questions.length} (${percentage.toFixed(1)}%)</p>
        </div>
    `;

    // Visa alla frågor med användarens svar och de rätta svaren
    endResults.innerHTML = results.map((result, i) => `
        <div class="question-result ${result.isCorrect ? 'correct' : 'incorrect'}">
            <p><strong>Fråga ${i + 1}:</strong> ${result.question}</p>
            <p>Ditt svar: ${result.userAnswer.join(', ')}</p>
            ${result.isCorrect ? '' : `<p>Rätt svar: ${result.correctAnswer.join(', ')}</p>`}
        </div>
    `).join('');
}


function initializeQuiz() {
    // Visa den första frågan när quizet startar
    showQuestion(0);

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) showQuestion(currentQuestionIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) showQuestion(currentQuestionIndex + 1);
    });

    // När användaren klickar på Lämna in knappen, räkna poängen och visa resultatet
    submitButton.addEventListener('click', () => {
        const results = calculateScore();
        showResults(results);
    });

    // När användaren klickar på Börja om knappen, ladda om sidan 
    restartButton.addEventListener('click', () => location.reload());
    
    // växla mellan ljust och mörkt tema
    temaBtn.addEventListener('click', () => {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');
        temaBtn.textContent = isDarkMode ? 'Ljust tema ☀️' : 'Mörkt tema 🌙';
    });

    updateSubmitButton();
}

// Starta quizet
initializeQuiz();