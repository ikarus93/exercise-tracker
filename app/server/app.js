const express = require("express"),
      app = express(),
      parser = require('body-parser');



//Middleware
app.use(parser.urlencoded({ extended: false }));
    
    
app.get("/", (req, res, next) => {
        res.sendFile('/client/index.html', {root: __dirname + "/../"});
});
    
app.post("/api/exercise/new-user", (req, res, next) => {
    const user = req.body.user;
    
        
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