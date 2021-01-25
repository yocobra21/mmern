const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const app = express();

const PORT = config.get('port');

app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/link', require('./routes/link.routes.js'));

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => { console.log(`App port: ---> ${PORT}`) });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

start();

