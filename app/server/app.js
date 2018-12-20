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
     
    const user = req.body.user;
    
    const database = new Db(); //create new instance of db
    try {
        
        const hasUser = await database.checkExistingUser(user);
        if (hasUser) {
            throw new Error("User already exists");
        }
        
        const result = await database.addUser(user);
        
        return res.json({"username": result["name"], "userId": result["userId"]})
        
        
    } catch(err) {
        console.log(err)
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
        
        if (Object.values(req.body).filter(x => x).length !== 4) throw new Error("Invalid request. Missing values in form");
        
        if (!helpers.validateDate(req.body.date)) throw new Error("Invalid Date supplied");
        
        if (req.body.dur.split("").filter(x => isNaN(parseInt(x))).length) throw new Error("Duration is not a valid number");
        

        const database = new Db();
        
        await database.createExercise(userId, desc, dur, date);
        
        res.json({userId: userId, desc: desc, dur: dur, date: date});
    
        
    } catch(err) {
        console.log(err);
    }
    
    
    
    
    
    
})

app.get("/api/exercise/log", async (req, res, next) => {
    /* Returns exercise log for specified user ("/api/exercise/add")
       Type of req -> "POST"
       req query parameters: id = userId, from = starting point, to = ending point, limit = limit of log entries to be returned 
       response on success -> json obj containing log
     */
     
    
    try {
        
        if (Object.values(req.query).filter(x => x).length !== 4) throw new Error("Invalid request. Please provide the necessary values as per Guideline");

        if (!helpers.validateDate(req.query.from) || !helpers.validateDate(req.query.to)) throw new Error("Invalid Date supplied");
        
        
        if (isNaN(parseInt(req.query.limit)) || req.query.limit === 0) req.query.limit = null;
        

        
        const database = new Db();
        
        let log = await database.getLog(req.query.userId, req.query.from, req.query.to);
        
        console.log(log)
        
        

    } catch(err) {
        console.log(err)
    }
    
})



app.listen(8080, () => {
    console.log("Server is running on port 8080");
})