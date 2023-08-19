const app = require('express').Router()
const axios = require('axios');
const cfg = require("../cfg/config.telegram.json");


// Ruta para enviar mensajes de Telegram
app.get('/', async (req, res) => {
    const botToken = cfg.token_bot;
    const chatId = req.query.recipient || cfg.chat_id; // Puede ser tu propio chat o un grupo
    const message = req.query.text || 'Welcome to the Movie Ticket Demo App for Node.js!';

    try {
        const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message
        });

        console.log('Mensaje enviado:', response.data);
        res.send('Mensaje enviado exitosamente.');
    } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
        res.status(500).send('Error al enviar el mensaje.');
    }
});

module.exports = app;