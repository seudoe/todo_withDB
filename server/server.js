const middle = require('./middleman.js');   // should be on the top - coz this loads the database

const express = require('express');
const path = require('path')
// const fs = require('fs').promises;

console.log(__dirname);
console.log(path.join(__dirname , '../home.html'));



const app = express();
const cors = require('cors');
// const { updateDb } = require('../home.js');
const {emailExists, authorized, getUserOf, addUser, middleConnector, updateMDb, printUsers} = middle;
// const middle = require('./middleman.js');    // old place , new place - on the top
app.use(cors())
app.use(express.json())

// -------------------------------------------

const PORT = 8899;
middleConnector(connectToDb);
function connectToDb(){
    app.listen(PORT, (err) => {
        if(err) console.log(err);
        console.log(`Server running on ${app.url}:${PORT}`);
    })
}


app.get('/', (req, res) => {
    res.status(400).sendFile(path.join(__dirname, '../index.html'));
    console.log('sent index.html')
});
  


// app.get('/login', (req, res) => {
//     res.header = {     // this is incorrect
//         "Content-Type" : "text/html"
//     }
//     res.status(200).end(login_js)
// });

// This wouldnt wort, coz how do we send login.js?

// From CHATGPT -------- to fix localStorage problem
// import { fileURLToPath } from "url";
// // const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// ----------------------- 
// END OF GPT CODE


// Create public/
app.use(express.static(path.join(__dirname, "..")));      // Serving assets on demand 

app.get('/login{/}' , (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../login.html'));
    console.log('sent login.html')
});



function loginChecker(req, res){
    let reqObj = req.body;
    // const autorizedVar = 
    authorized(reqObj.email, reqObj.pass, (authorizedV) => {
    if(authorizedV.status){
        console.log('status = 0');
        res.setHeader("Content-Type" , "text/plain")
        // res.status(200).sendFile(path.join(__dirname, '../home.html'));   // this causes the error : SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
        // when you do a fetch POST request (like in your login flow), the fetch call only receives the response data (e.g., JSON or text) 
        // but does not automatically cause the browser to navigate to a new page. Fetch is designed for background HTTP requests, not for page navigation

        res.status(202).send({
            status : 0
        })
    }
    else if (authorizedV.string === 'Exists'){
        console.log('status = 1');
        res.setHeader("Content-Type" , "application/json")
        res.status(300).send({
            status : 1
        })
    }  
    else if (authorizedV.string === 'Not-exists') {
        console.log('status = 2');
        res.setHeader("Content-Type" , "application/json")
        res.status(300).send({
            status:2
        })
    }
    })
    
}
function registerer(req, res) {

    if(req.body){
        res.setHeader("Content-Type" , "application/json")
        const reqObj = req.body;
        const {email, pass} = reqObj;
        addUser(email, pass, (result) => {
            if(result.acknowledged){
                console.log('during register: 0', )
                res.status(200).send({
                    status : 0
                })
            }
            else {
                console.log('during register: 1', )
                res.status(201).send({
                    status : 1
                })
            }
        })
    }
    else {
        console.log('Req is undefined')
        res.status(202).send({
            status : 2
        })
    }
}
app.post('/login{/}', 
    (req, res, next) => {
        console.log('req.body in app.post(/login)---- ', req.body)
        
        let reqObj = req.body;
        if(reqObj){
            const { action } = reqObj;
            console.log('action : ' ,action)
            if(action === 1) return loginChecker(req, res);
            else if(action === 0) return registerer(req, res);
        }
        next();
    },
    (req, res, next)=>{
        console.log('Finalizing');
    },
    (err, req, res, next) => {
        if(err) console.log('Errors: --------------------\n',err);

        // do nothing for now
    }
);

 
app.get('/home', (req, res) => {
    res.status(202).sendFile(path.join(__dirname, '../home.html'));
    console.log('sent home.html ');
})

app.post('/home', (req, res, next)=> {
    res.setHeader("Content-type" , "application/json");

    let {email} = req.body;
    console.log(`----------------------------------------------------
        \nreq.body in app.post(/home)-  `,req.body);
    if(authorizeLocal(req)){
        let userFound
        new Promise(resolve => {
            userFound = 
            emailExists(email, resolve);
            console.log('userFound in Promise: ', userFound)
        })
        .then(user => {
            console.log('userFound in then: ', user)
            if(user)
            res.status(200).json({
                status : 0,
                allnotes : {
                    notes : user.notes,
                    notesDone : user.notesDone
                }
            });
            else{
                res.status(400).json({
                    status : 1
                });
            }
        })
    }
    else {
        res.status(300).json({
            status : 2
        });
    }
    // printUsers();
});


app.put('/home', (req, res, next) => {

    res.setHeader("Content-type" , "application/json");

    console.log('in .put(/home) req.body : ' , req.body);
    if(req.body){
        const {email, reqNotes, reqDoneNotes} = req.body;

        if(authorizeLocal(req)){
            let status = updateMDb(email, reqNotes, reqDoneNotes);

            // let userFound = getUserOf(email);
            // userFound.notes = reqNotes;
            // userFound.notesDone = reqDoneNotes;
            
            res.status(200).json({
                status : 0
            });
        } 
        else {
            res.status(201).json({
                status : 1
            });
        }
    }
    else {
        res.status(201).json({
            status : 2
        });
    }
    // printUsers();
});

function authorizeLocal(req){
    const {email} = req.body;
    if(email) return true;
    else return false;
}



// Extra













/*
Some Errors :
1. local Storage Problem
problem : the .getItem in list.js was returning null, which was .setItem in login.js
reason : there was a difference between the urls of login.js and list.js
        The localStorages of differenct url and address is different
SOLN: changed all the urls to localhost 
Time Taken to Debug : 2.30PM to 5.30PM


2. Internal server error 500 in fetch() in list.js
problem : the fetch-post in list.js is creating problem 500 Internal server error
        it was trying to parse a html file, and showing parseError of '<' in console
        {
            the problem of parseError was actually due to :
            when the error of 500 comes, it tries to send an error page - which has html
            and that html file is being parse by json into object - which clearly gives error
        }
Explanation :
    Server-side 500 Internal Server Error on POST /home:
        The server code in server.js uses a variable users to find the user by email and return their notes. However, this users variable is not declared or imported in server.js. It is actually defined and exported in db.js and imported in middleman.js.
        Since server.js does not import users from db.js, when the POST /home route tries to access users.find(...), it causes a ReferenceError, which leads to the 500 Internal Server Error.
        To fix this, server.js must import users from db.js (e.g., const { users } = require('./db.js');) or access it via the imported middleman.js if it exports users.
        Without this fix, the server cannot process the request properly and returns an HTML error page, which is why the client receives HTML instead of JSON.
    Incorrect res.setHeader usage in server.js:
        In the POST /home route, the code calls res.setHeader({ "Content-type" : "application/json" }). This is incorrect usage of res.setHeader.
        The correct usage is res.setHeader("Content-Type", "application/json").
        The incorrect usage may cause the server to malfunction or ignore the header, contributing to response issues.
Time Taken to Debug: 5.40PM to 8.36PM


3. req.body is undefined 
problem : req.body in app.put('home/) is undefined, and hence db isnt updating
Explantion : the spelling header , instead or headers


4. checkFunc working only once
problem : once the check button is clicked, it stops functioning.. i.e.  it works only once
Explanation : i was updating the eventListeners before rendering 
*/