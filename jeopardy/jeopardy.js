// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const height = 5;
const width = 6;
let categories = [];

 // function structureTable() {
 //   for(let i=0; i<height; i++) {
 //     categories.push(Array.from({length:width}));
 //   }
 //   console.log(categories);
 // }

 function makeTable() {
   const table = document.createElement('table');
   table.classList.add('table')
   const thead = document.createElement('thead');
   const tr = document.createElement('tr')

   for(let i=0; i<width; i++) {
     const th = document.createElement('th');
     th.innerText = categories[i].title;
     th.classList.add('column-th')
     tr.append(th)
   }

   thead.append(tr);
   table.append(thead);

   const tbody = document.createElement('tbody');

   for(let y=0; y<height; y++) {
       const row  = document.createElement('tr');
       for(let x=0; x<width; x++) {
         const cell= document.createElement('td')
         cell.setAttribute('id',`${y}-${x}`);
         cell.classList.add('cell')
         cell.innerText= '$'
         row.append(cell);
       }
        tbody.append(row)
     }


table.append(tbody)
   document.body.prepend(table);

 }

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  const radndomCategoriesId=[];
  for(let i = 0; i <= 10; i++) {
  let response = await axios.get('https://jservice.io/api/random');
  radndomCategoriesId.push(response.data[0].category.id);
}
let shuffled_array = _.shuffle(radndomCategoriesId);
shuffled_array.splice(width,shuffled_array.length);
    return shuffled_array;
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
   let response = await axios.get(`https://jservice.io/api/category?id=${catId}`); //Id 300 problem

  const clues = getNRandomClues(response.data.clues)
  let categoryInfo = {
    title:response.data.title,
    clues,
  }
  return categoryInfo;
}

function getNRandomClues(clues, n=height) {
  const shuffled_array = _.shuffle(clues);
  shuffled_array.splice(n,shuffled_array.length);

  return shuffled_array;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

  async function fillTable() {

}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  const catIds = await getCategoryIds();

  catIds.forEach(async id => {
    const cat = await getCategory(id);
    categories.push(cat);
  })

  // makeTable()
}

setupAndStart()

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
