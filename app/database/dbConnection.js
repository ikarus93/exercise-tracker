const MongoClient = require('mongodb').MongoClient,
    helpers = require('../helpers/helpers');


// db constructor
function Db() {
    /* Class for DatabaseHandling
    Attributes:
                this.url => db url
    /* Class for DatabaseHandling
    Attributes:
                this.url => db url
    
    Methods:
                this.connect => opens connection via mongo client and returns db instance 
                this.disconnect => closes connection on current db instance
                this.checkExistingUser => checks whether a user with provided name already exists in db
                this.addUser => adds user to database returns boolean based on success of operation
                this.getNameFromId => gets username from supplied id
                this.createExercise => creates exercise with user input
                this.deleteTestUser => deletes the created user for testing purposes only
    */


    this.url = process.env.MONGO_URL; //env var from env.sh


    this.connect = function() {
        //opens and returns instance of database
        return MongoClient.connect(this.url, {
            useNewUrlParser: true
        });
    }

    this.disconnect = function(db) {
        //disconnects database,
        //parameters: DB - the current databaseObject
        db.close();
    }

    this.checkExistingUser = async function(name) {
        //checks whether user already in db
        //parameters: NAME - the user name in question
        //returns boolean based on result of query

        const client = await this.connect();
        const userCollection = client.db('fcc').collection('users');
        const res = await userCollection.findOne({
            "name": name
        });
        return res !== null && res.name !== null;

    }

    this.addUser = async function(name) {
        //Adds user to database, 
        //parameters: name - the username as string
        //returns object with name and id to identify user

        const client = await this.connect();

        const userCollection = client.db('fcc').collection('users'); //get user collection

        const res = await userCollection.insertOne({
            "name": name,
            "userId": 0
        }); //insert new user into document
        
        const userLength = await userCollection.countDocuments(); //get total of documents in collection to create unique id
        let userId = res["ops"][0]["_id"].toString().slice(0, 4) + userLength; //create user id

        const update = await userCollection.updateOne({
            "name": name
        }, {
            $set: {
                "userId": userId
            }
        });

        if (update["result"]["ok"]) {
            return {
                "name": name,
                "userId": userId
            }
        } else {
            let err = new Error("Couldn't successfully add User");
            err.status = 500;
            err.type = "Internal Server Error";
            throw err;
        }



    }

    this.getNameFromId = async function(userId, client) {
        // String, clientObject -> String
        // takes userId and database client object -> queries db for username relating to id, throws error on user missing

        const userCollection = client.db('fcc').collection('users');
        const username = await userCollection.findOne({
            "userId": userId
        });

        return username;



    }

    this.createExercise = async function(userId, desc, dur, date) {
        // Obj(userId, desc, dur, date) -> ...
        //Adds exercise to exercises collection
        //throws error if not successful

        const client = await this.connect();
        const username = await this.getNameFromId(userId, client);

        if (!username) {
            let err = new Error("Invalid user id");
            err.status = 401;
            err.type = "Unauthorized";
            throw err;
        }

        const exCollection = client.db('fcc').collection('exercises');
        const res = await exCollection.insertOne({
            "userId": userId,
            "desc": desc,
            "dur": dur,
            "date": date
        })

        if (!res.result.ok) {
            let err = new Error("Could not insert data into Database");
            err.status = 500;
            err.type = "Internal Server Error";
            throw err;
        }

    }

    this.getLog = async function(userId, to, from) {
        // String, Date, Date -> Array of Objects
        // Validates userId, then gets exercise log and fit it to date range
        const client = await this.connect();
        const userCollection = client.db('fcc').collection('users');
        const validUser = await userCollection.findOne({
            "userId": userId
        });

        if (!validUser) {
            let err = new Error("Invalid userId supplied");
            err.status = 401;
            err.type = "Unauthorized";
            throw err;
        }

        const exCollection = client.db('fcc').collection('exercises');
        const usersExercises = await exCollection.find({
            "userId": userId
        }).toArray();
        //fix filter dates and test commit changes
        return usersExercises.filter(ex => helpers.compareDates(to, ex.date) && helpers.compareDates(ex.date, from));

    }

    this.deleteTestUser = async (user) => {
        // String -> 
        // deletes the specified user from db
        //Functionality used for backend testing only
        const client = await this.connect();
        const userCollection = client.db('fcc').collection('users');
        const result = await userCollection.findOne({
            'name': user
        });
        if (result) {
            await userCollection.deleteOne({
                'name': user
            });

        }
        await userCollection.deleteMany({
            'name': null
        }); //Mlab just removes key/sets it to null, so this is to clean up db
    }

}
module.exports = Db;
