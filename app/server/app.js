const express = require("express"),
      app = express(),
      parser = require('body-parser'),
      db = require('../database/dbConnection');



//Middleware
app.use(parser.urlencoded({ extended: false }));
    
    
app.get("/", (req, res, next) => {
    /* Root url ("/")
       Type of Req: "GET"
       Response: index.html
     */
        res.sendFile('/client/index.html', {root: __dirname + "/../"});
});
    
app.post("/api/exercise/new-user", async (req, res, next) => {
    /* Creates new User ("/api/exercise/new-user")
       Type of req: "POST"
       req body parameters: user = name for new user
     */
     
    const user = req.body.user;
    
    const x = new db(); //create new instance of db
    try {
        
        const hasUser = await x.checkExistingUser(user);
        if (hasUser) {
            throw new Error("User already exists");
        }
        
        await x.addUser(user);
        console.log("success")
        
        
    } catch(err) {
        
    }
    
    
        
})

app.post("/api/exercise/add", (req, res, next) => {
    const {id, desc, dur, date} = req.body;
    
    if ([id, desc, dur, date].filter(x => x).length !== 4) {
        res.send("Please fill out all the fields");
    }
    
})

app.get("/api/exercise/log", (req, res, next) => {
    const [id, from, to, limit] = [req.query.userId, req.query.from, req.query.to, req.query.limit];
    
})



app.listen(8080, () => {
    console.log("Server is running on port 8080");
})