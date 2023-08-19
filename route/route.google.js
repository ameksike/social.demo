const app = require('express').Router()
const axios = require('axios');
const cfgGoogle = require("../cfg/config.google.json");

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
    // Redirige al enlace de autenticación de Google
    const clientId = cfgGoogle.web.client_id;
    const redirectUri = cfgGoogle.web.redirect_uris[0];
    const scope = 'profile';

    // Redirige al enlace de autenticación de Google
    const auth_uri = cfgGoogle.web.auth_uri || "https://accounts.google.com/o/oauth2/v2/auth";
    const request_uri = `${auth_uri}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    console.log(request_uri);
    res.redirect(request_uri);
});

app.get('/logout', (req, res) => {
    const clientId = cfgGoogle.web.client_id;
    const clientSecret = cfgGoogle.web.client_secret;
    const accessToken = req.query.token; // Obtén el token de acceso del usuario
    const token_uri = 'https://accounts.google.com/o/oauth2/revoke'; 
    const request_uri = `${token_uri}?token=${accessToken}`;

    console.log(request_uri);

    axios.post(request_uri, null, {
        auth: {
            username: clientId,
            password: clientSecret
        }
    })
        .then(() => res.send('Has cerrado sesión exitosamente.'))
        .catch(error => {
            console.error('Error al revocar el token:', error);
            res.send('Error al cerrar sesión.');
        });
});

// Ruta de autenticación de Google
app.get('/account', async (req, res) => {
    const user_uri = req.query.scope || 'https://www.googleapis.com/oauth2/v2/userinfo';
    const accessToken = req.query.token;
    try {
        // Utiliza el token de acceso para obtener la información del usuario
        const userResponse = await axios.get(user_uri, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userData = userResponse.data;
        console.log(userData);
        /**
           data: {
            id: '114583444545137644293',
            name: 'Antonio Membrides Espinosa (KSDT)',
            given_name: 'Antonio',
            family_name: 'Membrides Espinosa',
            picture: 'https://lh3.googleusercontent.com/a/AAcHTteWGEYpqPMmvPDeP6DIbrlCTra6upztDKMHIeqYAhxisxY=s96-c',   
            locale: 'es'
          }
        **/
        res.send(`<ul>
        <li>${userData.name}</li>
        <li><img src="${userData.picture}" /></li>
        <li>First Name: ${userData.given_name}</li>
        <li>Last Name: ${userData.family_name}</li>
        <li>Locale: ${userData.locale}</li>
        <li>ID: ${userData.id}</li>
        <li><a href="/google/logout?token=${accessToken}" >logout</a></li>
        </ul>`);
    } catch (error) {
        console.error('Error de cuenta:', error.message);
        res.send('Error de cuenta');
    }
});

// Ruta de callback después de la autenticación
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const clientId = cfgGoogle.web.client_id;
    const clientSecret = cfgGoogle.web.client_secret;
    const redirectUri = cfgGoogle.web.redirect_uris[0];
    const token_uri = cfgGoogle.web.token_uri || 'https://oauth2.googleapis.com/token';

    // Intercambia el código por un token de acceso
    try {
        const response = await axios.post(token_uri, null, {
            params: {
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }
        });
        console.log(response.data);
        res.redirect(`/google/account?token=${response.data.access_token}`);
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        res.send('Error de autenticación');
    }
});

module.exports = app;