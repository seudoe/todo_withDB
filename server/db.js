require('dotenv').config();
const { MongoClient } = require('mongodb')
const uri = process.env.MONGO_URI;

console.log('MONGO_URI:', process.env.MONGO_URI);


let db ;
function connectToDb(cb){
    // MongoClient.connect('mongodb://localhost:27017/todoer')
    MongoClient.connect(uri)
    .then(client => {
        db = client.db('todoer');
        // console.log(db);
        return cb(db, undefined); 
    })
    .catch(err =>{
        console.error("Database connection failed:", err);
        return cb(undefined, err);
    })
}


module.exports = { connectToDb,db};