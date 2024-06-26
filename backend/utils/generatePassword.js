function generatePassword() {
  const length = Math.floor(Math.random() * 6) + 10;
  const digits = '0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    password += digits[randomIndex];
  }

  return password;
}

module.exports = generatePassword;