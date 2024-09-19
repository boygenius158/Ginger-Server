"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate = require('otp-generator');
function randomnumber() {
    const otp = generate.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    return otp;
}
exports.default = randomnumber;
