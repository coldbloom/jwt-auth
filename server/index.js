require('dotenv').config()

const sequelize = require('./db')

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT;
const app = express();
const corsOptions = {credentials: true, origin: process.env.URL || '*'};

start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server start on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();