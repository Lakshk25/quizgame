const data = [];    // main data array in which all question , correct answer , incorrect answer in JSON format array
const bool_type = [0, 1];   // used for shuffling options (bool)
const multiple_type = [0, 1, 2, 3]; // used for shuffling options (multiple)
let counter = 0;        // counter to update questions on every next click
const options_array = [];       //  array holds data in 2D array of quiz options
let score = 0;
// api request sender (get request)
const api_handler = async (total_question, question_type, question_category, question_difficulty) => {
    const dataAPI = `https://opentdb.com/api.php?amount=${total_question}&category=${question_category}&difficulty=${question_difficulty}&type=${question_type}`;
    let response = await fetch(dataAPI);
    let api_data = await response.json() // our data is in JSON format
    return api_data;
}


//  extract necessary data (question , correct answer , incorrect answer) from api array
const question_generator = (data_array) => {
    for (const key in data_array.results) {
        let div = document.createElement('div');
        div.innerHTML = data_array.results[key].question;
        let question = div.innerHTML;
        div.innerHTML = data_array.results[key].correct_answer;
        let answer = div.innerHTML;
        div.innerHTML = data_array.results[key].incorrect_answers;
        let incorrect = div.innerHTML;
        const ques_ans_pair = {
            'question': question,
            'correct_answer': answer,
            'incorrect_answer': incorrect,
        }
        // push JSON in data array
        data.push(ques_ans_pair);
    }
}

//  get data choosen by the user 

const get_options_data = () => {
    const total_questions = document.querySelector('#ques-total');  // number of questions
    const question_type = document.querySelector('#ques-type');     // question type (bool or multiple)
    const question_category = document.querySelector('#ques-cat');  // question category
    const question_difficulty = document.querySelector('#ques-difficulty'); // question difficulty
    let total_que = total_questions.options[total_questions.selectedIndex].text;        // get question number
    let type = question_type.options[question_type.selectedIndex].text;         // get type data
    let category = question_category.options[question_category.selectedIndex].text;     // get category text
    let difficulty = question_difficulty.options[question_difficulty.selectedIndex].text;       // get difficulty
    // combine this data in JSON format
    combineData = {
        'total_question': total_que,
        'question_type': type,
        'question_category': category,
        'difficulty': difficulty
    }
    return combineData;
}

//  category to respective number converter (in this api question category is selected by number)

const question_to_num = (key) => {
    if (key == 'General Knowledge') {
        return 9;
    }
    else if (key == 'Entertainment: Books') {
        return 10;
    }
    else if (key == 'Entertainment: Film') {
        return 11;
    }
    else if (key == 'Entertainment: Music') {
        return 12;
    }
    else if (key == 'Entertainment: Musicals & Theatres') {
        return 13;
    }
    else if (key == 'Entertainment: Television') {
        return 14;
    }
    else if (key == 'Entertainment: Video Games') {
        return 15;
    }
    else if (key == 'Entertainment: Board Games') {
        return 16;
    }
    else if (key == 'Science & Nature') {
        return 17;
    }
    else if (key == 'Science: Computers') {
        return 18;
    }
    else if (key == 'Science: Mathematics') {
        return 19;
    }
    else if (key == 'Mythology') {
        return 20;
    }
    else if (key == 'Sports') {
        return 21;
    }
    else if (key == 'Geography') {
        return 22;
    }
    else if (key == 'History') {
        return 23;
    }
    else if (key == 'Politics') {
        return 24;
    }
    else if (key == 'Art') {
        return 25;
    }
    else if (key == 'Celebrities') {
        return 26;
    }
    else if (key == 'Animals') {
        return 27;
    }
    else if (key == 'Vehicles') {
        return 28;
    }
    else if (key == 'Entertainment: Comics') {
        return 29;
    }
    else if (key == 'Science: Gadgets') {
        return 30;
    }
    else if (key == 'Entertainment: Japanese Anime & Manga') {

        return 31;
    }
    else if (key == 'Entertainment: Cartoon & Animation') {
        return 32;
    }
}

//  for shuffling order of quiz options

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


// used to add choices in quiz game (button maker for choices)

function options_maker(size) {
    document.querySelector('.answers').classList.add('choices');
    for (let index = 0; index < size; index++) {
        let temp = document.querySelector('.answers');
        let btn = document.createElement('button');
        btn.classList.add('choice');
        temp.appendChild(btn);
    }
}


// this function used for updating question on every next click until all questions not appeared

function question_updater() {
    let header = document.querySelector('#header h1');
    if (counter == data.length) {
        header.innerHTML = `your score is ${score} out of ${data.length}`;
        let again = document.querySelector('.next');
        again.innerHTML = 'again';
        again.addEventListener('click' , ()=>{
            location.reload();
        });
        document.querySelector('.answers').style.display = 'none';
        this.removeEventListener('click', question_updater);
    }
    else {
        option_updater(counter, question_type);
        header.innerHTML = `Q${counter + 1}. ${data[counter].question}`;
    }
    counter++;  // counter to update question
}

//  options updater to update choices of quiz 

function option_updater(counter, question_type) {
    user_choice();
    if (question_type == 'multiple') {
        for (let index = 0; index < 4; index++) {
            document.querySelectorAll('.choice')[multiple_type[index]].innerHTML = options_array[counter][index];
        }
    }
    else if (question_type == 'boolean') {
        for (let index = 0; index < 2; index++) {
            document.querySelectorAll('.choice')[bool_type[index]].innerHTML = options_array[counter][index];
        }
    }
    shuffle(multiple_type);
    shuffle(bool_type);
}

//  user chosse which option
function user_choice() {
    document.querySelector('.next').disabled = true;
    const temp = document.querySelectorAll('.choice');
    temp.forEach(answer => {
        answer.disabled = false;
        answer.addEventListener('click', selectAnswer);
        if(answer.classList.contains('correct') || answer.classList.contains('incorrect') || answer.classList.contains('noHover')){
            answer.classList.remove('correct');
            answer.classList.remove('incorrect');
            answer.classList.remove('noHover');
        }
    });
}

function disable_options(){
    const temp = document.querySelectorAll('.choice');
    temp.forEach(element => {
        element.disabled = true;
        if(element.classList.contains('correct')){
            element.classList.add('correct');
        }
        else{
            if(element.innerHTML == data[counter-1].correct_answer){
                element.classList.add('correct');
            }
            else{
                element.classList.add('incorrect');
            }
        }
        element.classList.add('noHover');
    });
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    if(selectedBtn.innerHTML == data[counter-1].correct_answer){
        score++;
        selectedBtn.classList.add('correct');
    }
    else{
        selectedBtn.classList.add('incorrect');
    }
    document.querySelector('.next').disabled = false;
    disable_options();
}



// main function

const questionData = () => {
    const options = document.querySelector('.options');
    options.style.display = 'none';
    combineData = get_options_data();
    total_question = combineData.total_question;
    question_type = combineData.question_type;
    question_category = question_to_num(combineData.question_category);
    question_difficulty = combineData.difficulty;
    api_handler(total_question, question_type, question_category, question_difficulty).then(data_array => {
        question_generator(data_array);
    })
        .then(() => {
            document.querySelector('.next_btn').classList.add('next');

            if (question_type == 'boolean') {
                options_maker(2);
            }
            else {
                options_maker(4);
            }
        })
        .then(() => {
            document.querySelector('#header h1').classList.add('header_question');
            document.querySelector('#header h1').innerHTML = `Q${counter + 1}. ${data[counter].question}`;
            let next = document.querySelector('.next_btn');
            next.addEventListener('click', question_updater);
            // update question correct and incorrect answer to array
            for (let index = 0; index < data.length; index++) {
                options_array.push(data[index].incorrect_answer.split(','));
                options_array[index].push(data[index].correct_answer);
            }
            option_updater(counter, question_type);
            counter++;
        })
        // on user choice click
        .then(() => {
            user_choice();
        })
}

