const validateUserInput = (name, email, password) => {
  const errors = [];
  
  // Block fake names
  const fakeName = /^(demo|test|fake|admin|user|sample|example)$/i;
  if (fakeName.test(name.trim()) || name.trim().length < 3) {
    errors.push('Please enter your real full name (minimum 3 characters).');
  }
  
  // Block temporary email domains
  const fakeEmailDomains = [
    'tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', 'throwaway.email', 'example.com', 'test.com', 'fake.com'
  ];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (fakeEmailDomains.includes(emailDomain)) {
    errors.push('Please use a valid email address from a real email provider.');
  }
  
  // Strong password requirements
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    errors.push('Password must contain uppercase, lowercase, and numbers.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLoginInput = (email, password) => {
  const errors = [];
  
  // Block fake email domains
  const fakeEmailDomains = [
    'tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', 'throwaway.email', 'example.com', 'test.com', 'fake.com'
  ];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (fakeEmailDomains.includes(emailDomain)) {
    errors.push('Please use a valid email address from a real email provider.');
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