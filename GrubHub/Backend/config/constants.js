const jwtSecret = 'mahalasa_narayani';
const saltRounds=10;
const address = "http://localhost:";
const uri= 'mongodb+srv://root:root@cluster0-skd7n.mongodb.net/test?retryWrites=true&w=majority';
module.exports = {
  jwtSecret,saltRounds,address,uri
}