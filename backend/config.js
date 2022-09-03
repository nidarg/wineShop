import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  CLOUD_NAME:process.env.CLOUD_NAME,
CLOUD_API_KEY:process.env.CLOUD_API_KEY,
CLOUD_API_SECRET:process.env.CLOUD_API_SECRET,
};