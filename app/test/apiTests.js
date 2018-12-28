
process.env.NODE_ENV = "test";

const chai = require("chai"),
      chaiHttp = require("chai-http"),
      app = require("../server/app"),
      expect = require("chai").expect,
      Db = require('../database/dbConnection'),
      helpers = require('../helpers/helpers');
      
      


/* Testing of REST API */
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
                expect(res.body["username"]).to.equal("testname");
                expect(res.body["userId"]).to.be.a('string');
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
                expect(res.body["userId"]).to.equal("5c242");
                expect(res.body["desc"]).to.equal("Lorem Ipsum");
                expect(res.body["dur"]).to.equal("100");
                expect(res.body["date"]).to.equal("2018-12-27");
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
      
        it("should THROW 401 error if userId is doesn't exist in db", (done) => {
            chai.request(app)
            .post("/api/exercise/add")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ userId: "random123",
                    desc: "Lorem Ipsum",
                    dur: 100,
                    date: "2018-12-27"
            })
            .end((err, res) => {
                                console.log("RES", res.body)

                expect(res).to.have.status(401);
                done();
          })
          
      })
      

  })
  
    describe("/GET /api/exercise/log", () => {
      it("should GET the users exercise log", (done) => {
            chai.request(app)
            .get("/api/exercise/log?id=5c253&from=1999-10-01&to=2000-10-01&limit=0")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                expect(res.body[0]["userId"]).to.equal("5c253");
                expect(res.body[0]["desc"]).to.equal("Running");
                expect(res.body[0]["dur"]).to.equal("100");
                expect(res.body[0]["date"]).to.equal("1999-10-01");
                done();
          })
              
      })
      
      it("should GET the users exercise log and limit the amount of entries", (done) => {
         chai.request(app)
            .get("/api/exercise/log?id=5c242&from=1999-10-01&to=2005-10-01&limit=2")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.length(2)
                done();
          })
              
          
      })
      
            it("should GET the users exercise log limited to a certain time period", (done) => {
         chai.request(app)
            .get("/api/exercise/log?id=5c242&from=2001-01-01&to=2003-01-01&limit=0")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.length(2);
                done();
          })
              
          
      })
      
        it("should GET have an empty response body if time limit out of scale", (done) => {
         chai.request(app)
            .get("/api/exercise/log?id=5c242&from=2003-01-01&to=2004-01-01&limit=0")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.length(0);
                done();
          })
              
          
      })
      
    it("should THROW 400 error if not all query parameters are set", (done) => {
         chai.request(app)
            .get("/api/exercise/log?id=5c242&to=2004-01-01&")
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
              
      })
      
          it("should THROW 400 error if one or both dates are invalid", (done) => {
         chai.request(app)
            .get("/api/exercise/log?id=5c242&from=200-01-01&to=2004-01-01&limit=0")
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
          })
              
      })
      
              it("should THROW 401 error userId is invalid or not registered", (done) => {
         chai.request(app)
            .get("/api/exercise/log?id=random123&from=2002-01-01&to=2004-01-01&limit=0")
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
          })
              
      })
    })
    
    
    
    /* Testing of helper functions */
    
    describe("helpers.validateDate()", () => {
        
        it("should return TRUE if date passed in is of valid formate yyyy-mm-dd", (done) => {
            expect(helpers.validateDate("2001-01-02")).to.be.true;
            done()
        })
        
        
        it("should return FALSE if month is invalid", (done) => {
            expect(helpers.validateDate("2001-18-02")).to.be.false;
            done()
        })
        
                it("should return FALSE if day is invalid", (done) => {
            expect(helpers.validateDate("2001-02-35")).to.be.false;
            done()
        })
        
         it("should return FALSE if format is invalid", (done) => {
            expect(helpers.validateDate("2001.02.02")).to.be.false;
            done()
        })
        
    })
    
    describe("helpers.compareDates", () => {
        
        it("should return TRUE if date1 is larger than date2", (done) => {
            expect(helpers.compareDates("2001-02-02", "1999-01-01")).to.be.true;
            done()
        })
        
              it("should return TRUE if date1 is equal to date2", (done) => {
            expect(helpers.compareDates("2001-02-02", "2001-02-02")).to.be.true;
            done()
        })
        
          it("should return FALSE if date1 is smaller to date2", (done) => {
            expect(helpers.compareDates("2001-02-02", "2003-02-02")).to.be.false;
            done()
        })
    })


