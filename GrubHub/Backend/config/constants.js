const jwtSecret = 'mahalasa_narayani';
const saltRounds=10;
const address = "http://ec2-18-188-18-252.us-east-2.compute.amazonaws.com:";
const addressAllowed="http://ec2-18-224-179-63.us-east-2.compute.amazonaws.com:3000";
const uri= 'mongodb+srv://root:root@cluster0-skd7n.mongodb.net/test?retryWrites=true&w=majority';
module.exports = {
  jwtSecret,saltRounds,address,uri,addressAllowed
}