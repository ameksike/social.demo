const axios = require('axios');
const cfg = require("../cfg/config.telegram.json");

// https://strapengine.com/telegram-bot-webhook-tutorial/

async function send(message, chatId) {
    try {
        const url = cfg.url_send.replace("{BOT_TOKEN}", cfg.token_bot);
        const bdy = {
            chat_id: chatId,
            text: message
        };
        console.log("TELEGRAM:info", url, bdy);
        const res = await axios.post(url, bdy);
        return res.data;
    }
    catch (error) {
        console.log("TELEGRAM:SEND ", error);
    }
}

async function hook(callback_url) {
    try {
        callback_url = callback_url || cfg.redirect_uris;
        const url = cfg.url_hook.replace("{BOT_TOKEN}", cfg.token_bot);
        const bdy = {
            params: {
                url: callback_url,
                drop_pending_updates: true
            }
        };
        console.log("TELEGRAM:hook", url, bdy);
        const res = await axios.get(url, bdy);
        return res.data;
    }
    catch (error) {
        console.log("TELEGRAM:hook ", error?.response?.data?.description || error?.message);
    }
}

async function info() {
    try {
        const url = cfg.url_info.replace("{BOT_TOKEN}", cfg.token_bot);
        console.log("TELEGRAM:info", url);
        const res = await axios.get(url);
        return res.data;
    }
    catch (error) {
        console.log("TELEGRAM:hook ", error);
    }
}

async function updates() {
    try {
        const url = cfg.url_update.replace("{BOT_TOKEN}", cfg.token_bot);
        console.log("TELEGRAM:info", url);
        const res = await axios.get(url);
        return res.data;
    }
    catch (error) {
        console.log("TELEGRAM:hook ", error);
    }
}

module.exports = {
    send,
    hook,
    info,
    updates
};