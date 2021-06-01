import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


import routes from './api';
import {setupCloudinary} from "./utils/utilities";

const app = express();

// app.use(logger('dev'));
app.use(express.json());
// app.use(setupCloudinary())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes());


export default app;