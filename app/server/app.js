const express = require("express"),
      app = express(),
      parser = require('body-parser'),
      Db = require('../database/dbConnection'),
      helpers = require('../helpers/helpers');



//Middleware
app.use(parser.urlencoded({ extended: false })); //Bodyparser
    
    
app.get("/", (req, res, next) => {
    /* Root url ("/")
       Type of req -> "GET"
       response on success -> index.html
     */
        res.sendFile('/client/index.html', {root: __dirname + "/../"});
});
    
app.post("/api/exercise/new-user", async (req, res, next) => {
    /* Creates new User ("/api/exercise/new-user")
       Type of req -> "POST"
       req body parameters: user = name for new user
       response on success -> json obj containing username and userId
     */
     try {
    const user = req.body.user;
    if (!req.body.user) {
        let err = new Error("Please provide a username");
        err.status = 400;
        err.type = "Bad Request";
        throw err;
    }
    
    const database = new Db(); //create new instance of db
    
        
        const hasUser = await database.checkExistingUser(user);
        if (hasUser) {
            let err = new Error("User already exists");
            err.status = 400;
            err.type = "Bad Request";
            throw err;
        }
        
        const result = await database.addUser(user);
        return res.json(JSON.stringify({username: result["name"], userId: result["userId"]}))
        
        
    } catch(err) {
        next(err);
    }
    
    
        
})

app.post("/api/exercise/add", async (req, res, next) => {
    /* Creates new entry for exercise ("/api/exercise/add")
       Type of req -> "POST"
       req body parameters: id = userId, desc = description, dur = duration, date = date 
       response on success -> json obj containing username and userId
     */
     
    const {userId, desc, dur, date} = req.body;

    try {
        
        if (Object.values(req.body).filter(x => x).length !== 4) {
            let err = new Error("Invalid request. Missing values in form");
            err.status = 400;
            err.type = "Bad Request";
            throw err;
        }
        
        if (!helpers.validateDate(req.body.date)) {
            let err = new Error("Invalid Date supplied");
            err.status = 400;
            err.type = "Bad Request";
            throw err;
        }
        
        if (req.body.dur.split("").filter(x => isNaN(parseInt(x))).length){
            let err = new Error("Duration is not a valid number");
            err.status = 400;
            err.type = "Bad Requuest";
            throw err;
        } 
        

        const database = new Db();
        
        await database.createExercise(userId, desc, dur, date);
        
        res.json({userId: userId, desc: desc, dur: dur, date: date});
    
        
    } catch(err) {
        next(err);
    }
    
})

app.get("/api/exercise/log", async (req, res, next) => {
    /* Returns exercise log for specified user ("/api/exercise/add")
       Type of req -> "POST"
       req query parameters: id = userId, from = starting point, to = ending point, limit = limit of log entries to be returned 
       response on success -> json array of objects containing log
     */
     
    
    try {
        
        
        if (Object.values(req.query).filter(x => x).length !== 4){
            let err = new Error("Invalid request. Please provide the necessary values as per Guideline");
            err.status = 400;
            err.type = "Bad Request";
            throw err;
        }  

        if (!helpers.validateDate(req.query.from) || !helpers.validateDate(req.query.to)){
            let err = new Error("Invalid Date supplied");
            err.status = 400;
            err.type = "Bad Request";
            throw err; 
        }  
        
        req.query.limit = parseInt(req.query.limit);

        if (isNaN(req.query.limit) || req.query.limit === 0) req.query.limit = null;  //return all entries if limit is 0 or undefined
        

        
        const database = new Db();
        
        let log = await database.getLog(req.query.userId, req.query.to, req.query.from);
        log = log.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        let responseData;
        
        if (req.query.limit !== null) {
            responseData = log.slice(0, req.query.limit);
        } else {
            responseData = log;
        }

        
       return res.json(responseData);
        
        

    } catch(err) {
        next(err);
    }
    
})

//===Error Handling===//
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({type: err.type || "Server Error", status: err.status || 500, message: err.message || "Unknow Error occured"});
})



app.listen(8080 || process.env.PORT, () => {
    console.log("Server is running on port 8080");
})

module.exports = app; //for testing