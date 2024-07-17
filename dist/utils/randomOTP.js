"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = randomnumber;
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
