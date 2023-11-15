require('dotenv').config();

const sequelize = require('./db');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const router = require('./router/index');

const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

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