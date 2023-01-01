require('dotenv').config();

import express from 'express';
import paymentRoutes from './routes/payment.routes';
import morgan from 'morgan';
import path from 'path';

/* El proyecto se ejecuta con este comando: 
nodemon src/index.js --exec babel-node */

const app = express();

app.use(morgan('dev'));

app.use(paymentRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT);
console.log("Server on port ", process.env.PORT);