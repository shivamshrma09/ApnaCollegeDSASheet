const validator = require('validator');

const BLOCKED_EMAILS = [
  'test@test.com',
  'dummy@dummy.com',
  'fake@fake.com',
  'example@example.com',
  'user@user.com',
  'admin@admin.com',
  'test@gmail.com',
  'test123@gmail.com'
];

const BLOCKED_NAMES = [
  'test',
  'dummy',
  'fake',
  'user',
  'admin',
  'example',
  'asdf',
  'qwerty',
  '123',
  'abc'
];

const validateUserInput = (name, email, password) => {
  const errors = [];

  // Name validation
  if (!name || typeof name !== 'string') {
    errors.push('Name is required');
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (trimmedName.length > 50) {
      errors.push('Name must be less than 50 characters');
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      errors.push('Name can only contain letters and spaces');
    }
    if (BLOCKED_NAMES.includes(trimmedName.toLowerCase())) {
      errors.push('Please enter your real name');
    }
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const trimmedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(trimmedEmail)) {
      errors.push('Please enter a valid email address');
    }
    if (BLOCKED_EMAILS.includes(trimmedEmail)) {
      errors.push('Please use a real email address');
    }
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const emailDomain = trimmedEmail.split('@')[1];
    if (disposableDomains.includes(emailDomain)) {
      errors.push('Disposable email addresses are not allowed');
    }
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    const weakPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123'];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('Please choose a stronger password');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLoginInput = (email, password) => {
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!validator.isEmail(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateUserInput,
  validateLoginInput
};