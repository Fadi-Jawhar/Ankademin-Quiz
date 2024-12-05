import { questions } from './src/questions.js';

let currentIndex = 0;

function renderQuestion(index) {
    const question = questions[index];
    questionContainer.innerHTML = `
      <h2>${question.question}</h2>
      <div>
        ${question.options
          .map(
            (option, i) => `
          <label>
            <input type="radio" name="q${index}" value="${option}">
            ${option}
          </label>
        `
          )
          .join('')}
      </div>
    `;
  }



renderQuestion(currentIndex);
