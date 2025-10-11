import { updateDb, renderNotes, renderDoneNotes, updateEventListeners } from "./home.js";
export class List {
    id;
    note;
    time;
    constructor(id, note, time){
        this.id = id;
        this.note = note;
        this.time = time;
    }
}

console.log('In list.js  ------- for debugging');

export let notes = [];
export let doneNotes = [];
let current = JSON.parse(localStorage.getItem('localEmail'));
console.log('In list.js --------------- \n Curret_user : ',current);
export function loadNotes(){
    console.log('In loadNotes in list.js------------------- ')
    fetch('/home', {
        method : 'POST',
        headers :{
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({
            email : current.email
        })
    })
    .then(response =>{console.log('response : ', response); return response.json()})
    .then (data => {
        console.log('response data : ',data);
        if(data){
            console.log('notes data in loadNotes\n: ', data)
            if(data.status === 0){
                notes = data.allnotes.notes;
                doneNotes = data.allnotes.notesDone;

                notes = notes.map((note, index) => {
                    return new List(note.id, note.note, dayjs(note.time));
                })
                doneNotes = doneNotes.map((note, index) => {
                    return new List(note.id, note.note, dayjs(note.time));
                })
                repaint();
            }
            if(data.status === 1 || data.status === 2){
                window.location.href = '/login';
                return;
            }
        }
    })
    .catch(err => {
        console.log('Errors: --------------------\n',err);
    })

    // notes = JSON.parse(localStorage.getItem('notes'));

}

function repaint(){
    renderDoneNotes();
    renderNotes();
    updateEventListeners();
}
// export function loadUndoneNotes(){
//     doneNotes = JSON.parse(localStorage.getItem('doneNotes'));
//     doneNotes = doneNotes.map((note, index) => {
//         return new List(note.id, note.note, dayjs(note.time));
//     })
// }


loadNotes();
// repaint();
// loadUndoneNotes();

/*
notes = [
    {
        id : '0001',
        note : 'Eat Eggs Perfect',
        date : dayjs()
    },
    {
        id : '0002',
        note : 'Do the Laundary',
        date : dayjs()
    },
    {
        id : '0003',
        note : 'Do the homework',
        date : dayjs()
    },
    {
        id : '0004',
        note : 'Complleter Something',
        date : dayjs()
    },
    {
        id : '0005',
        note : 'Very long note',
        date : dayjs()
    },
    {
        id : '0006',
        note : 'somethinngs wrong Bro',
        date : dayjs()
    },
    {
        id : '0007',
        note : 'Notes are lil wierd here',
        date : dayjs()
    },
    {
        id : '0008',
        note : 'Eat Eggs Perfect',
        date : dayjs()
    }
].map((note, index) => {
    return new List(note.id, note.note, dayjs(note.time));
});

doneNotes = [
    {   
        id : '00003',
        note : 'Done note 1',
        time : dayjs()
    }, 
    {
        id : '8932',
        note : 'Done note 2',
        time : dayjs()
    }
].map((doneNote, index) => {
    return new List(doneNote.id, doneNote.note, dayjs(doneNote.time));
});

// */
// updateDb();
// updateLocalStorage();





