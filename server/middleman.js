const { connectToDb } = require('./db.js')
// const db = require('./db.js');          // should be on the top - loads database
// const { users } = db; 
// console.log('users :          ',JSON.parse(JSON.stringify(users)));
// console.log('users :          ',users);

let db;
function middleConnector(listener){
    connectToDb((dbres, err) => {
        if (err) {
            console.error("middleConnector: DB connection failed:", err);
            // don't call listener() if DB failed. You can decide to exit process or retry.
            return;
        }
        db = dbres;                   // <-- set db first
        console.log("middleConnector: DB is ready\n");
        listener();                   // <-- then start the server

    })
}



function emailExists(email, func){
    let userToReturn = undefined;
    db.collection('users')                       ///   users
    .findOne({email : email})
    // .forEach(user => {
    //     if(email === user.email) userToReturn = user;
    // })
    .then((doc) => {
        userToReturn = doc; 
        console.log('in function email Exits: --------------\ndoc:',doc)
        console.log('in function email Exits: --------------\nuserToReturnn:',userToReturn)
        func(userToReturn)
        return
    })
    .catch(err => {
        console.log(err)
        func(userToReturn)
        return
    });
    // func(userToReturn)
    console.log('In emailExists: ', userToReturn);   // undefined - as finding isnt sync 

    // return users.find( (user) => {
    //     return user.email === email;
    // });
}



function authorized(email, password, func) {
    new Promise(resolve => {
        // let user = 
        emailExists(email, resolve);
    })
    .then((user) => {
        if(user){
            func({
                status : user.password === password,
                string : 'Exists'
            });
        }
        else {
            console.log('email doest exist');
            func({ 
                status : false,
                string : 'Not-exists'
            });
        }
    })
}

function getUserOf(email){
    let userToReturn = undefined;
    db.collection('users')                       ///  full users
    .findOne({email : email})
    // .forEach(user => {
    //     if(email === user.email) userToReturn = user;
    // })
    .then(doc => {userToReturn = doc})
    .catch(err => console.log(err));
    return userToReturn;
    // return users.find(user => user.email === email);
}

function addUser(email, pass, func){
    new Promise(resolve => {
        emailExists(email , resolve)
    })
    .then (user => {
        let resultToReturn ;
        if(user){
            func(false)
            return;
        }
        db.collection('users')
        .insertOne({
            email : email,
            password: pass,
            notes: [
                {
                    id: '0001',
                    note : 'Welcome Note',
                    date : 'somedate'
                }
            ],
            notesDone: [
                {
                    id: '0001',
                    note : 'Done note',
                    date : 'sone'
                }
            ]
        })
        .then(result =>{
            resultToReturn = result; 
            console.log(result)
            func(result);
        })
        .catch(err => func(err))
    })
    // if(emailExists(email)){
    //     return false;
    // }
    // users.push({
    //     email : email,
    //     password: pass,
    //     notes: [
    //         {
    //             id: '0001',
    //             note : 'Welcome Note',
    //             date : 'somedate'
    //         }
    //     ],
    //     notesDone: [
    //         {
    //             id: '0001',
    //             note : 'Done note',
    //             date : 'sone'
    //         }
    //     ]
    // });
    // return true;
}

function updateMDb(email, notes, doneNotes){
    return db.collection('users')
    .updateOne({email : email}, {$set: { notes: notes, notesDone: doneNotes }})
    .then(result => {
        return result;
    })
    .catch(err => err);
}

function printUsers(){
    let allUsers = [];
    
    console.log('users ---------------------------------------------------\n', 
        JSON.stringify(users, null, 2)
    )
}

module.exports = { emailExists, authorized, getUserOf, addUser, middleConnector, updateMDb };

