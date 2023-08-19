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

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
