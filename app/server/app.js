const express = require("express"),
      app = express(),
      parser = require('body-parser'),
      Db = require('../database/dbConnection'),
      helpers = require('../helpers/helpers');



//Middleware
app.use(parser.urlencoded({ extended: false }));
    
    
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
     
    const {id, desc, dur, date} = req.body;

    try {
        
        if (Object.values(req.body).filter(x => x).length !== 4) throw new Error("Invalid request. Missing values in form");
        
        if (!helpers.validateDate(req.body.date)) throw new Error("Invalid Date supplied");
        
        if (isNaN(parseInt(req.body.dur))) throw new Error("Duration is not a valid number");
        
    
        const database = new Db();
        
        database.createExercise(id, desc, dur, date)
    
        
    } catch(err) {
        console.log(err);
    }
    
    
    
    
    
    
})

app.get("/api/exercise/log", (req, res, next) => {
    const [id, from, to, limit] = [req.query.userId, req.query.from, req.query.to, req.query.limit];
    
})



app.listen(8080, () => {
    console.log("Server is running on port 8080");
})