const generate = require('otp-generator');

export default function randomnumber(): string {
  const otp: string = generate.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
}
