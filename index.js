const express = require('express');
const app = express();
const PORT = 3000;

// auth 
app.use('/google', require('./route/route.google'));
app.use('/facebook', require('./route/route.facebook'));
app.use('/github', require('./route/route.github'));

// messages 
app.use('/telegram', require('./route/route.telegram'));
app.use('/whatsapp', require('./route/route.whatsapp'));

// home 
app.use('/', (req, res) => {
  res.send(`<ul>
    <li><a href="/google/login">GOOGLE</a></li>
    <li><a href="/github/login">GITHUB</a></li>
    <li><a href="/facebook/login">FACEBOOK</a></li>
    <li> ---- </li>
    <li><a href="/telegram/info">TELEGRAM</a></li>
    <li><a href="/whatsapp/info">WHATSAPP</a></li>
  </ul>`);
});


// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
