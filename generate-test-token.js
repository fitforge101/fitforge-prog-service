require('dotenv').config();
const jwt = require('jsonwebtoken');

// Change this ID to whatever user you want to test with
const testUserId = 'user123';

// Grab secret from .env, or use the dev default
const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

const payload = {
  id: testUserId,
  name: "Test User",
  role: "user"
};

// Sign a token that expires in 1 hour
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('--- TEST JWT START ---');
console.log(token);
console.log('--- TEST JWT END ---');
console.log('\nUse this token in your Authorization header like:');
console.log(`Authorization: Bearer ${token}`);
