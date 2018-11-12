const {SHA256} = require('crypto-js');
const becrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let password = '123abc!';

// becrypt.genSalt(10, (err,salt) =>{
//   becrypt.hash(password, salt, (err, hash)=>{
//     console.log(hash);
//   });
// });

let hashedPassword = '$2a$10$IVu1J1gM0X5djQ3xfokWg.cqjV0bJL4U.Uv4juoCC2wXq23CvH1Wa';

becrypt.compare(password,hashedPassword, (err,res)=>{
  console.log(res);
});

// let data = {
//   id: 10
// };
// let token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded  = jwt.verify(token, '123abc');
// console.log('decoded: ' ,decoded);

// let message = "I am user number 3";
// let hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// // //Evil hacker
// token.data.id =5;
// token.hash = SHA256(JSON.stringify(data)).toString();


// let resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed don\'t trust' );

// }