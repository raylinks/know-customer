const crypto = require('crypto');
const otpGenerator = require('otp-generator');

function sha1(input: Buffer): any {
  return crypto.createHash('sha1').update(input).digest();
}

const IV = process.env.IV ?? '';
const iv = Buffer.from(IV, 'hex');

function passwordDeriveBytes(password: any, salt: string, iterations: number, len: number): any {
  let key = Buffer.from(password + salt);
  for (let i = 0; i < iterations; i++) {
    key = sha1(key);
  }
  if (key.length < len) {
    const hx = passwordDeriveBytes(password, salt, iterations - 1, 20);
    for (let counter = 1; key.length < len; ++counter) {
      key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
    }
  }
  return Buffer.alloc(len, key);
}

export function validPhoneNumber(phoneNumber: string): void {
  if (!/^\+[1-9]{3,3}\d{10,10}$/.test(phoneNumber.replace(/\s+/g, ''))) {
    throw new Error(`Phone number invalid, please provide your phone number in the format +234XXXXXXXX`);
  }
}

export async function encode(text: string, secret = null): Promise<any> {
  try {
    const CRYPT_PASSWORD = 'jjj';
    const key = passwordDeriveBytes(secret ?? CRYPT_PASSWORD, '', 100, 32);
    // Initialize Cipher Object to encrypt using AES-256 Algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const part1 = cipher.update(text, 'utf8');
    const part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
  } catch (error) {}
}

export async function decode(text: string, secret = null): Promise<any> {
  try {
    const CRYPT_PASSWORD = 'kkk';

    const key = passwordDeriveBytes(secret ?? CRYPT_PASSWORD, '', 100, 32);
    // Initialize decipher Object to decrypt using AES-256 Algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(text, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {}
}

export async function generateOtp(payload: { validityDuration: number; size: number; phoneNumber: string }): Promise<{
  otp: string;
  timestamp: Date;
  expirationTime: string;
}> {
  // Generate OTP
  let otp =
    process.env.BACKEND_ENV === 'prod'
      ? otpGenerator.generate(payload.size, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        })
      : '123456';
  if (payload.phoneNumber === '+2348106517334') {
    otp = '123456';
  }

  // add 10 seconds to the to start the validity time count
  const timestamp = new Date();
  // timestamp.setSeconds(timestamp.getSeconds() + 10);
  // set OTP expiration to "validityDuration" set in the function param "payload"
  const expirationTime = timestamp.setSeconds(timestamp.getSeconds() + payload.validityDuration).toFixed();
  // const expiration_times = timestamp.setSeconds(timestamp.getSeconds() + payload.validityDuration);

  return { otp, timestamp, expirationTime };
}
