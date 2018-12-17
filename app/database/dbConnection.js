const MongoClient = require('mongodb').MongoClient;


// db constructor
function Db () {
    /* Class for DatabaseHandling
    Attributes:
                this.url => db url
    
    Methods:
                this.connect => opens connection via mongo client and returns db instance 
                this.disconnect => closes connection on current db instance
                this.checkExistingUser => checks whether a user with provided name already exists in db
                this.addUser => adds user to database returns boolean based on success of operation
    */
    
    
    this.url = process.env.MONGO_URL; //env var from env.sh
    
    
    this.connect = function() {
        //opens and returns instance of database
        return MongoClient.connect(this.url);
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
        const res = await userCollection.findOne({"name": name});
        
        if (res !== null) {
            return true;
        } else {
            return false;
        }
        
        
        
    }
    
    this.addUser = async function(name) {
        //Adds user to database, 
        //parameters: name - the username as string
        //returns ID to identify user
        
        const client = await this.connect();
        const userCollection = client.db('fcc').collection('users');
        const res = await userCollection.insert({"name": name});
        console.log(res)
        
        
        
    }
    
}
module.exports = Db;





