const app = require('express').Router()
const cfg = require("../cfg/config.telegram.json");
const kshook = require("kshook");
const tel = new kshook.driver.Telegram({
    tokenBot: cfg.token_bot
});

// https://core.telegram.org/bots
// https://www.youtube.com/watch?v=GEydlPTqp6E
// https://core.telegram.org/bots#how-do-i-create-a-bot

// Ruta para enviar mensajes de Telegram
app.get('/', async (req, res) => {
    const chatId = req.query.recipient || cfg.chat_id;
    const message = req.query.text || 'Welcome to the Movie Ticket Demo App for Node.js!';
    const response = await tel.send({ message, chatId });
    console.log('Mensaje enviado:', response);
    return response ? res.send('Mensaje enviado exitosamente.') : res.status(500).send('Error al enviar el mensaje.');
});

// Ruta para enviar mensajes de Telegram
app.get('/on/message', async (req, res) => {
    try {
        const update = req.body;
        if (update.message) {
            const chatId = update.message.chat.id;
            const messageText = update.message.text;
            // Maneja el mensaje recibido
            console.log(`Mensaje recibido de ${chatId}: ${messageText}`);
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
        res.status(500).send('Error al enviar el mensaje.');
    }
});

app.get('/info', async (req, res) => {
    const response = await tel.info();
    return response ? res.send(response) : res.status(500).send('Error on set info.');
});

app.get('/updates', async (req, res) => {
    const response = await tel.updates();
    return response ? res.send(response) : res.status(500).send('Error on set info.');
});

app.get('/config', async (req, res) => {
    const response = await tel.hook(cfg.redirect_uris);
    return response ? res.send(response) : res.status(500).send('Error on set config.');
});

module.exports = app;