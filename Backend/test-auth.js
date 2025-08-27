// Simple test script to verify authentication
const { validateUserInput, validateLoginInput } = require('./utils/validation');

console.log('Testing Authentication Validation...\n');

// Test valid user
console.log('1. Testing valid user:');
const validUser = validateUserInput('John Doe', 'john.doe@gmail.com', 'password123');
console.log('Valid user result:', validUser);

// Test dummy entries
console.log('\n2. Testing dummy entries:');
const dummyUser1 = validateUserInput('test', 'test@test.com', '123456');
console.log('Dummy user 1 result:', dummyUser1);

const dummyUser2 = validateUserInput('fake', 'fake@fake.com', 'password');
console.log('Dummy user 2 result:', dummyUser2);

// Test invalid email
console.log('\n3. Testing invalid email:');
const invalidEmail = validateUserInput('John Doe', 'invalid-email', 'password123');
console.log('Invalid email result:', invalidEmail);

// Test short name
console.log('\n4. Testing short name:');
const shortName = validateUserInput('A', 'john@gmail.com', 'password123');
console.log('Short name result:', shortName);

// Test login validation
console.log('\n5. Testing login validation:');
const validLogin = validateLoginInput('john@gmail.com', 'password123');
console.log('Valid login result:', validLogin);

const invalidLogin = validateLoginInput('invalid-email', '');
console.log('Invalid login result:', invalidLogin);

console.log('\nAuthentication validation tests completed!');