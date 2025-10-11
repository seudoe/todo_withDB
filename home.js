// console.log('In home.js ');
// import { act } from "react";
// import { current_user } from "./login.js";

let current_user = JSON.parse(localStorage.getItem('localEmail'));
console.log('In home.js after list.js ------- for debuggin ');
console.log('current_user in home.js: ', current_user)
import { notes, List, doneNotes } from "./list.js";    // turns out whereever u put immport - it is executed first in the file

console.log('Notes: ',notes);   // --------------------------------------------------------
console.log('In home.js 1');   // --------------------------------------------------------

export function renderNotes(){
    document.querySelector('.header-logo').innerHTML = `Todoer of ${current_user.email}`
    let notesList = document.querySelector('.notesListDiv');
    notesList.innerHTML = ``;       // reseting the div
    notes.forEach((note, index) => {
        
        console.log('Rendering Notes');    // --------------------------------------------------------

        notesList.innerHTML += returnHTML(note);
    });
}
function returnHTML (note){
    return `
            <div class="noteDiv">
                <div class="checkbox-div">
                    <input type="checkbox" class="noteCheck">
                </div>
                <div class="note-div"><input type="text" class="note-input" value="${note.note}" readonly></div>
                <div class="note-date-div">${note.time.format('HH:mm   DD/MM/YYYY')}</div>
                <div class="buttons-div">
                    <button class="edit edit-${note.id}"><img src="./imgs/edit.png" alt=""></button>
                    <button class="delete delete-${note.id} "><img src="./imgs/delete.png" alt=""></button>
                    <button class="saveButton save-${note.id}" hidden><img src="./imgs/save.png" alt="" ></button>
                </div>
            </div>
        `;
}
renderNotes();
// document.querySelector('.noteListDiv').innerHTML = ``;
// ${note.date.format('HH:mm   DD/MM/YYYY')}
console.log('In home.js below renderNotes');    // --------------------------------------------------------

export function renderDoneNotes(){
    console.log('rendering doneNotes ----------------');   // --------------------------------------------------------
    console.log('doneNotes: ',doneNotes);   // --------------------------------------------------------
    

    let doneNotesList = document.querySelector('.doneNotesListDiv');
    doneNotesList.innerHTML = `
        <div class="done-label">
            Done:
        </div>
    `;    // To add the label for done notes
    doneNotes.forEach((doneNote, index) => {
        doneNotesList.innerHTML += `
            <div class="doneNoteDiv">
                <div class="doneCheck-div">
                    <input type="checkbox" class="doneNoteCheck" checked>
                </div>
                <div class="doneNote-div">
                    <input type="text" class="doneNote-input" value="${doneNote.note}" readonly>
                </div>
                <div class="donebuttons-div">
                    <button class="done-delete"><img src="./imgs/delete.png" alt=""></button>
                </div>
            </div>
        `
    });
}
renderDoneNotes();


export function updateEventListeners(){

    let checkboxList = document.querySelectorAll('.noteCheck');

    let saveButtonList = document.querySelectorAll('.saveButton');
    let deleteButtonList = document.querySelectorAll('.delete');
    let editButtonList = document.querySelectorAll('.edit');
    let dateList = document.querySelectorAll('.note-date-div');
    let inputList = document.querySelectorAll('.note-input');



    function checkFunc(index){
        doneNotes.unshift(new List(notes[index].id, notes[index].note, notes[index].time));
        notes.splice(index, 1);
        renderDoneNotes(); renderNotes();
        updateDb();
        updateEventListeners();
    }
    checkboxList.forEach((checkBox, index) => {
        // console.log('button is clicked')
        checkBox.onclick = () => checkFunc(index);
    })

    function editFunc(index){
        editButtonList[index].style.display = 'none';
        saveButtonList[index].style.display = 'block';
        dateList[index].style.display = 'none';
        inputList[index].readOnly = false;

        inputList[index].focus();
        inputList[index].setSelectionRange(inputList[index].value.length, inputList[index].value.length);
        // updateLocalStorage();
    }
    editButtonList.forEach((editButton, index) => {
        // editButton.removeEventListener('click',() => editFunc(index));
        // editButton.addEventListener('click',() => editFunc(index));

        editButton.onclick = () => editFunc(index);
    });


    function saveFunc(index) {
        // deleteButtonList[index].style.display = 'block';
        saveButtonList[index].style.display = 'none';
        editButtonList[index].style.display = 'block';
        dateList[index].style.display = 'block';
        notes[index].time = dayjs();
        inputList[index].readOnly = true;

        notes[index].note = inputList[index].value;
        console.log('Notes: '); console.log(notes);    // --------------------------------------------------------
        // updateLocalStorage();
        updateDb();
    }
    saveButtonList.forEach((saveButton, index) => {
        // saveButton.removeEventListener('click', () => saveFunc(index));
        // saveButton.addEventListener('click', () => saveFunc(index));
        saveButton.onclick = () => saveFunc(index);
    });
    inputList.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if(event.key == 'Enter'){
                saveButtonList[index].click();
            }
        });
    });

    function deleteFunc(index)  {
        notes.splice(index, 1);
        // updateLocalStorage();
        updateDb();
        // window.location.reload();
        renderNotes();
        updateEventListeners();
        console.log('Notes: '); console.log(notes);   // --------------------------------------------------------
        
    }
    deleteButtonList.forEach((deleteButton, index)=>{ 
        // deleteButton.removeEventListener('click', () => deleteFunc(index));
        // deleteButton.addEventListener('click', () => deleteFunc(index));
        deleteButton.onclick = () => deleteFunc(index);
    });

    function doneDeleteFunc(index){
        doneNotes.splice(index, 1);

        // updateLocalStorage();
        updateDb();
        renderDoneNotes();
        updateEventListeners();
        console.log('DoneNotes: '); console.log(doneNotes);   // --------------------------------------------------------
    }
    let doneDeleteButtonList = document.querySelectorAll('.done-delete');
    doneDeleteButtonList.forEach((doneDeleteButton, index) => {
        doneDeleteButton.onclick = () => doneDeleteFunc(index);
    });

    function doneCheckFunc(index){
        notes.unshift(new List(doneNotes[index].id, doneNotes[index].note, doneNotes[index].time));
        doneNotes.splice(index, 1);
        renderNotes();
        renderDoneNotes();
        // updateLocalStorage();
        updateDb();
        updateEventListeners();
    }
    let doneCheckBoxList = document.querySelectorAll('.doneNoteCheck');
    doneCheckBoxList.forEach((doneCheckBox, index) => {
        doneCheckBox.onclick = () => doneCheckFunc(index);
    })  

}
updateEventListeners();

export function updateDb(){
    console.log('Updating db ...');
    fetch('/home', {
        method: 'PUT',
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            email : current_user.email,
            reqNotes : notes,
            reqDoneNotes : doneNotes
        })
    })
    .then( response => response.json())
    .then(data => {
        if(data.status === 0){
            console.log('Updated');
        }
        else if(data.status === 1){
            console.log('Authorization Problem , Please try to log-in again maybe');
        }
        else if(data.status === 2){
            console.log('request is undefined');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}


// export function updateLocalStorage(){
//     localStorage.setItem('notes', JSON.stringify(notes));
//     localStorage.setItem('doneNotes', JSON.stringify(doneNotes));
// }

document.querySelector('.add-button').addEventListener('click', () => {
    let inp = document.querySelector('.new-input');
    document.querySelector('.add-new-note-div').style.display = 'block';
    inp.focus();
    inp.setSelectionRange(inp.value.length, inp.value.length);

    document.querySelector('main').style.filter = 'blur(10px)';

});

document.querySelector('.cancel').addEventListener('click', () => {
    document.querySelector('main').style.filter = 'none';
    document.querySelector('.add-new-note-div').style.display = 'none';
})

document.querySelector('.new-input').addEventListener('keydown', (event)=> {
    if(event.key == 'Enter'){
        document.querySelector('.add-add').click();
    }
});

document.querySelector('.add-add').addEventListener('click', () => {
    // let x = document.querySelector('.notesListDiv');
    
    let inp = document.querySelector('.new-input');
    notes.unshift(new List(    // add note to the beginning of the list
        '0004',
        inp.value,
        dayjs()
    ));

    console.log('NotesInAdd-Add'); console.log(notes);  // --------------------------------------------------------
    // let newHTML =  returnHTML(notes[notes.length -1]);
    // document.querySelector('.notesListDiv').innerHTML = x.slice(0, 0) + newHTML + x.slice(0);
    renderNotes();
    updateDb();
    inp.value = ``;

    // updateLocalStorage();
    document.querySelector('.add-new-note-div').style.display = 'none';
    document.querySelector('main').style.filter = 'none';
    updateEventListeners();
});

let logoutButton = document.querySelector('.logout-button');
logoutButton.onclick = () => {
    localStorage.setItem('localEmail', '');
    window.location.href = '/login'
}