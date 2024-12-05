import { questions } from './src/questions.js';


const questionContainer = document.querySelector('#questionContainer');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');


let currentIndex = 0;

function renderQuestion(index) {
  const question = questions[index];
  questionContainer.innerHTML = `
    <h2>${question.question}</h2>
    <ul>
      ${question.options.map(option => `<li>${option}</li>`).join('')}
    </ul>
  `;
}

function updateButtons() {
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === questions.length - 1;
}


document.body.append(prevButton, nextButton);

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
    updateButtons();
  }
});

nextButton.addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
    updateButtons();
  }
});

renderQuestion(currentIndex);
updateButtons();