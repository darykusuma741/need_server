import express, { Application } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import cors from 'cors';
import fs from 'fs';
import { RouterIndex } from './router';

const allowedOrigins = ['http://localhost:5173', 'https://houderrent.com:8091', 'http://localhost:4173', 'http://localhost:8087', 'https://localhost:8091'];
const allowedMethods = ['GET', 'POST', 'DELETE', 'OPTIONS'];

const port = process.env.PORT || 8802;
const app: Application = express();
const server = !process.env.PORT
  ? http.createServer(app)
  : https.createServer(
      {
        key: fs.readFileSync('ssl/privkey.pem', 'utf-8'),
        cert: fs.readFileSync('ssl/cert.pem', 'utf-8'),
        ca: fs.readFileSync('ssl/fullchain.pem', 'utf-8'),
      },
      app
    );

const corsOptions = {
  origin: allowedOrigins,
  methods: allowedMethods,
  allowedHeaders: 'Content-Type,Authorization,Accept,Access-Control-Allow-Origin',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(__dirname));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '30mb',
    parameterLimit: 50000,
  })
);
app.use(express.static('uploads'));
app.use('/apiv1', RouterIndex);

server.listen(port, () => {
  console.log(`Telah terkoneksi di port http://localhost:${port}/`);
});
