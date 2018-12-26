
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
                expect(res["text"]).to.equal('"{\\"username\\":\\"testname\\",\\"userId\\":\\"5c231\\"}"')
                done();
          })
              
          }).catch(err => {
              console.log(err);
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
  })

