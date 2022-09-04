import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import path from 'path';
// import {fileURLToPath} from 'url';

// const __filename = fileURLToPath(import.meta.url);


// const __dirname = path.dirname(__filename);
import config from './config.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import fileUpload from 'express-fileupload'
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    console.log('Connected to mongodb.');
  })
  .catch((error) => {
    console.log(error.reason);
  });
const app = express();


app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles:true
}))
app.use('/api/uploads', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});

cloudinary.config({
  cloud_name:config.CLOUD_NAME,
  api_key:config.CLOUD_API_KEY,
  api_secret:config.CLOUD_API_SECRET,
})
// app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.resolve(__dirname, './frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './frontend,index.html'));
});
app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});
app.listen(config.PORT, () => {
  console.log('serve at http://localhost:5000');
});