import { questions } from './src/questions.js';

// Variabler för quizens tillstånd
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill([]);

// DOM-element som vi använder för att visa och hantera quizet.
const questionContainer = document.querySelector('#questionContainer');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');
const temaBtn = document.querySelector('#temaBtn');
const questionNumber = document.querySelector('#questionNumber');


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

function initializeQuiz() {
    // Visa den första frågan när quizet startar
    showQuestion(0);

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) showQuestion(currentQuestionIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) showQuestion(currentQuestionIndex + 1);
    });
    
    // Hantera klick på Tema-knappen för att växla mellan ljust och mörkt tema
    temaBtn.addEventListener('click', () => {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');
        temaBtn.textContent = isDarkMode ? 'Ljust tema ☀️' : 'Mörkt tema 🌙';
    });

    updateSubmitButton();
}

// Starta quizet
initializeQuiz();