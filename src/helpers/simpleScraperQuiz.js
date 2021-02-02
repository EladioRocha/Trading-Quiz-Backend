/**
 * The next functions doesnt scrape automatically, they need the execute directly on browser
 * to get all data, because the complex of made one scraper per page is more time than
 * if execute directly and get the data directly on browser.
 */

/**
 * Scraper of site: trading-education.
 */

let questions = []
function getData() {
  data = {
    question: {
      en: document.querySelector('.question-head-title').innerText
    }
  },
    answers = []

  for (res of document.querySelectorAll('.question-list > li')) {
    answers.push({
      answer: {
        en: res.lastChild.innerText
      },      
      isCorrect: false
    })
  }
  data.answers = answers
  questions.push(data)
  return data
}

function showAndCleanQuestions() {
  console.log(JSON.stringify(questions))
  questions = []
}