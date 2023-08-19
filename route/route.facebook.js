const app = require('express').Router()
const axios = require('axios');
const cfgFacebook = require("../cfg/config.facebook.json");

// https://developers.facebook.com/docs/facebook-login/web

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
  const clientId = cfgFacebook.client_id;
  const redirectUri = cfgFacebook.redirect_uri;
  // Redirige al enlace de inicio de sesión de Facebook
  const request_uri = `${cfgFacebook.auth_uri}?client_id=${clientId}&redirect_uri=${redirectUri}`;
  console.log(request_uri);
  res.redirect(request_uri);
});


// Ruta de autenticación de Google
app.get('/account', async (req, res) => {
  const accessToken = req.query.token;
  try {
    // Utiliza el token de acceso para obtener la información del usuario
    const userResponse = await axios.get(cfgFacebook.profile_uri, {
      headers: {},
      params: {
        fields: 'id,name,email,picture,first_name,last_name,middle_name,name_format,birthday,gender,hometown,location,link,locale,timezone,verified,age_range',
        access_token: accessToken
      }
    });
    const userData = userResponse.data;
    console.log(userData);
    res.send(`<ul>
      <li>${userData.name}</li>
      <li>ID: ${userData.id}</li>
      <li><img src="${userData.picture.data.url}" /></li>
      <li>First Name: ${userData.first_name}</li>
      <li>Last Name: ${userData.last_name}</li>
      <li><a href="/facebook/logout?token=${accessToken}" >logout</a></li>
      </ul>`);
  } catch (error) {
    console.error('Error de cuenta en github:', error.message);
    res.send('Error de cuenta en github');
  }
});

// Ruta de callback después del inicio de sesión
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  const clientId = cfgFacebook.client_id;
  const clientSecret = cfgFacebook.client_secret;
  const redirectUri = cfgFacebook.redirect_uri;
  // Intercambia el código por un token de acceso
  try {
    const response = await axios.get(cfgFacebook.token_uri, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code
      }
    });
    console.log(response.data);
    res.redirect(`/facebook/account?token=${response.data.access_token}`);
  } catch (error) {
    console.error('Error de inicio de sesión en Facebook:', error.message);
    res.send('Error de inicio de sesión en Facebook');
  }
});


app.get('/logout', (req, res) => {
  const clientId = cfgFacebook.client_id;
  const clientSecret = cfgFacebook.client_secret;
  const accessToken = req.query.token;
  const request_uri = `https://graph.facebook.com/v12.0/${clientId}/permissions`;

  console.log(request_uri);

  axios.delete(request_uri, {
    params: {
      access_token: accessToken,
      client_id: clientId,
      client_secret: clientSecret
    }
  })
    .then(response => {
      console.log('Token de acceso revocado en Facebook:', response.status);
    })
    .catch(error => {
      console.error('Error al revocar el token de acceso en Facebook:', error.message);
    });
});

module.exports = app;