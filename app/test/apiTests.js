
process.env.NODE_ENV = "test";

const chai = require("chai"),
      chaiHttp = require("chai-http"),
      app = require("../server/app"),
      expect = require("chai").expect,
      Db = require('../database/dbConnection.js');
      
      



     chai.use(chaiHttp);

  
  describe("/GET /", () => {
      it("it should GET the index.html file", (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.be.html;
              done();
            });
      });
  });
  
  describe("/POST /api/exercise/new-user", () => {
      it("should CREATE a new user in database and return json object with username and id", (done) => {
          new Db().deleteTestUser('testname').then(ok => {
            chai.request(app)
            .post("/api/exercise/new-user")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ user: "testname"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                let resText = JSON.parse(JSON.parse(res["text"]))
                expect(resText["username"]).to.equal("testname");
                expect(resText["userId"]).to.be.a('string');
                done();
          })
              
          }).catch(err => {
              //console.log(err);
              throw new Error(err);
          })
          
      })
      
      it("should THROW 400 error if username is missing in response body", (done) => {
          chai.request(app)
        .post("/api/exercise/new-user")
            .send({user: ""})
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
          
      })
      
      it("should THROW 400 error if username already exists", (done) => {
        chai.request(app)
        .post("/api/exercise/new-user")
            .send({user: "alreadyExists"})
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
          
      })
  })
  
  
  describe("/POST /api/exercise/add", () => {
      it("should CREATE a new user in database and return json object with username and id", (done) => {
            chai.request(app)
            .post("/api/exercise/add")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ userId: "5c242",
                    desc: "Lorem Ipsum",
                    dur: 100,
                    date: "2018-12-27"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                let resText = JSON.parse(res["text"])
                expect(resText["userId"]).to.equal("5c242");
                expect(resText["desc"]).to.equal("Lorem Ipsum");
                expect(resText["dur"]).to.equal("100");
                expect(resText["date"]).to.equal("2018-12-27");
                done();
          })
              
      })
      
      it("should THROW 400 error if fields in request form are empty", (done) => {
            chai.request(app)
            .post("/api/exercise/add")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ userId: "5c242",
                    desc: "Lorem Ipsum",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
          
      })
      
           
      it("should THROW 400 error if date supplied is invalid", (done) => {
            chai.request(app)
            .post("/api/exercise/add")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ userId: "5c242",
                    desc: "Lorem Ipsum",
                    dur: 100,
                    date: "20022-18-123"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
          
      })
      
            it("should THROW 400 error if duration is invalid/NaN", (done) => {
            chai.request(app)
            .post("/api/exercise/add")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ userId: "5c242",
                    desc: "Lorem Ipsum",
                    dur: "ABC",
                    date: "20022-18-123"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
          
      })
      
                 it("should THROW 400 error if userId is doesn't exist in db", (done) => {
            chai.request(app)
            .post("/api/exercise/add")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ userId: "random123",
                    desc: "Lorem Ipsum",
                    dur: "ABC",
                    date: "2018-12-27"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
          
      })
      

  })


