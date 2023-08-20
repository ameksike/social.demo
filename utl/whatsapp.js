const axios = require('axios');
const cfg = require("../cfg/config.whatsapp");

function sendMessage(data, token = "") {
    const config = {
        method: 'post',
        url: `https://graph.facebook.com/${cfg.version}/${cfg.phone_number_id}/messages`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
}

function getTextMessageInput(recipient, text) {
    return JSON.stringify({
        "messaging_product": "whatsapp",
        "preview_url": false,
        "recipient_type": "individual",
        "to": recipient,
        "type": "text",
        "text": {
            "body": text
        }
    });
}

module.exports = {
    sendMessage: sendMessage,
    getTextMessageInput: getTextMessageInput
};