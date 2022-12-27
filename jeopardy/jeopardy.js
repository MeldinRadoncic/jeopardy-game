// // categories is the main data structure for the app; it looks like this:

// //  [
// //    { title: "Math",
// //      clues: [
// //        {question: "2+2", answer: 4, showing: null},
// //        {question: "1+1", answer: 2, showing: null}
// //        ...
// //      ],
// //    },
// //    { title: "Literature",
// //      clues: [
// //        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
// //        {question: "Bell Jar Author", answer: "Plath", showing: null},
// //        ...
// //      ],
// //    },
// //    ...
// //  


const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const JEOPARDY_API_URL = 'https://jservice.io/api/';

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  const response = await axios.get(`${JEOPARDY_API_URL}categories`, {
    params: {
      count: NUM_CATEGORIES
    }
  });
  return response.data.map(category => category.id);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  const response = await axios.get(`${JEOPARDY_API_URL}category`, {
    params: {
      id: catId
    }
  });
  return {
    title: response.data.title,
    clues: _.shuffle(response.data.clues).slice(0, NUM_QUESTIONS_PER_CAT).map(clue => {
      return {
        question: clue.question,
        answer: clue.answer,
        showing: null
      };
    })
  };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  const thead = $('#jeopardy thead');
  const tbody = $('#jeopardy tbody');

  // clear existing table
  thead.empty();
  tbody.empty();

  // create header row
  const tr = $('<tr>');
  for (let i = 0; i < categories.length; i++) {
    const td = $('<td>').text(categories[i].title);
    tr.append(td);
  }
  thead.append(tr);

  // create question rows
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    const tr = $('<tr>');
    for (let j = 0; j < categories.length; j++) {
      const td = $('<td>').text('?').addClass('question').data('clue', categories[j].clues[i]);
      tr.append(td);
      tbody.append(tr);
    }
  }
  
  /** Handle clicking on a clue: show the question or answer.
   *
   * Uses .showing property on clue to determine what to show:
   * - if currently null, show question & set .showing to "question"
   * - if currently "question", show answer & set .showing to "answer"
   * - if currently "answer", ignore click
   * */
  
  function handleClick(evt) {
    const clue = $(evt.target).data('clue');
    if (clue.showing === null) {
      $(evt.target).text(clue.question).removeClass('question').addClass('question-shown');
      clue.showing = 'question';
    } else if (clue.showing === 'question') {
      $(evt.target).text(clue.answer).removeClass('question-shown').addClass('answer-shown');
      clue.showing = 'answer';
    }
  }
  
  /** Wipe the current Jeopardy board, show the loading spinner,
   * and update the button used to fetch data.
   */
  
  function showLoadingView() {
    $('#jeopardy').hide();
    $('#spin-container').show();
    $('#start').text('Restart').attr('disabled', true);
  }
  
  /** Remove the loading spinner and update the button used to fetch data. */
  
  function hideLoadingView() {
    $('#jeopardy').show();
    $('#spin-container').hide();
    $('#start').text('Start').attr('disabled', false);
  }
  
  /** Start game:
   *
   * - get random category Ids
   * - get data for each category
   * - create HTML table
   * */
  
  async function setupAndStart() {
    showLoadingView();
    categories = [];
    const categoryIds = await getCategoryIds();
    for (let i = 0; i < categoryIds.length; i++) {
      const category = await getCategory(categoryIds[i]);
      categories.push(category);
    }
    fillTable();
    hideLoadingView();
  }
  

 /** On click of start / restart button, set up game. */
 $('#start').click(setupAndStart);
  
 /** On page load, add event handler for clicking clues */
 
 $('#jeopardy tbody').on('click', '.question, .question-shown', function(evt) {
    handleClick(evt);
  });
}


fillTable()
