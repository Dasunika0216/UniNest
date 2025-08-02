import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Accepts recipient phone and message as parameters
export const sendSMS = (to, body) => {
  return client.messages.create({
    body,
    from: fromPhone,
    to,
  });
};