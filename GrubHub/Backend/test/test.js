var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

it("Should check credentials and return status code", function(done){
    chai.request('http://localhost:3001')
    .post('/users/login')
    .send({ "username": "nayakmitra7@gmail.com", "password" : "mahalasa1"})
    .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(JSON.parse(res.text).message).to.equal("Successful Login");
        done();
    });
})

it("Should fetch details of orders that are newly placed for a given restaurant ", function(done){
    chai.request('http://localhost:3001')
    .get('/order/new/5dabf19056adf162ae8e5f19')
    .set('Authorization','jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGFiY2YxOGI3YjYwNTU4ZTk4ZGFmYTgiLCJpYXQiOjE1NzI5ODc4MzcsImV4cCI6MTU3MzA3NDIzN30.2kLKrfxXdPZ9z-Cjvo_lj3NKA_XU71PuKLBw4EcBssQ')
    .end(function (err, res) {
        expect(JSON.parse(res.text)[0].orderDate).to.equal("2019-11-3 17:0");
        expect(JSON.parse(res.text)[0].buyerId).to.equal("5db620a1c6efc825018b7b5e");
        expect(JSON.parse(res.text)[0].buyerAddress).to.equal("1516 vista club circle\napt no 102");
        expect(JSON.parse(res.text)[0].buyerFirstName).to.equal("Mohan");
        expect(JSON.parse(res.text)[0].buyerLastName).to.equal("n");
        expect(JSON.parse(res.text)[0].restaurantId).to.equal("5dabf19056adf162ae8e5f19");
        expect(JSON.parse(res.text)[0].restaurantName).to.equal("Vaikunt");
        done();
    });
})

it("Should check if the item that needs to be edited has the necessary item name field", function(done){
    chai.request('http://localhost:3001')
    .put('/item')
    .set('Authorization','jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGFiY2YxOGI3YjYwNTU4ZTk4ZGFmYTgiLCJpYXQiOjE1NzI5ODc4MzcsImV4cCI6MTU3MzA3NDIzN30.2kLKrfxXdPZ9z-Cjvo_lj3NKA_XU71PuKLBw4EcBssQ')
    .send({ "itemName": "", "itemPrice" : "1","itemSection":"5dc1ce28ca3bfe208dcc7b8d"})
    .end(function (err, res) {
        expect(JSON.parse(res.text)[0].msg).to.equal("Item Name is needed.")
        done();
    });
})

it("Fetch sent messages for a given owner", function(done){
    chai.request('http://localhost:3001')
    .get('/message/sent/5dc1ce01ca3bfe208dcc7b8c')
    .set('Authorization','jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGFiY2YxOGI3YjYwNTU4ZTk4ZGFmYTgiLCJpYXQiOjE1NzI5ODc4MzcsImV4cCI6MTU3MzA3NDIzN30.2kLKrfxXdPZ9z-Cjvo_lj3NKA_XU71PuKLBw4EcBssQ')
    .end(function (err, res) {
        expect(JSON.parse(res.text)[0].senderFirstName).to.equal("ross cafe")
        expect(JSON.parse(res.text)[0].receiverFirstName).to.equal("Jaya")
        expect(JSON.parse(res.text)[0].receiverLastName).to.equal("Nayak")
        expect(JSON.parse(res.text)[0].messageBody).to.equal("I have confirmed")
        expect(JSON.parse(res.text)[0].orderDate).to.equal("2019-11-5 11:37")
        expect(JSON.parse(res.text)[0].messageDate).to.equal("2019-11-5 11:44")
        done();
    });
})


it("Should check if the user is a regisered user and send a message if he is not", function(done){
    chai.request('http://localhost:3001')
    .post('/owner/login')
    .send({ "username": "joh.snow@gmail.com", "password" : "1234"})
    .end(function (err, res) {
        expect(res).to.have.status(201)
        expect(JSON.parse(res.text)[0].msg).to.equal("Unregistered User!");
        done();
    });
})