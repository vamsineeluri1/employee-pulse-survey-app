const bcrypt = require('bcrypt');

const password = 'password'; // change if needed
const hashed = bcrypt.hashSync(password, 10);
console.log('Hashed Password:', hashed);