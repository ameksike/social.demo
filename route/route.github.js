const app = require('express').Router()
const axios = require('axios');
const cfgGithub = require("../cfg/config.github.json");

// doc
// https://docs.github.com/es/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
    const clientId = cfgGithub.client_id;
    const redirectUri = cfgGithub.redirect_uri;
    const scope = 'user';

    // Redirige al enlace de inicio de sesión de GitHub
    res.redirect(`${cfgGithub.auth_uri}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
});


// Ruta de callback después del inicio de sesión
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const clientId = cfgGithub.client_id;
    const clientSecret = cfgGithub.client_secret;
    const redirectUri = cfgGithub.redirect_uri;

    // Intercambia el código por un token de acceso
    try {
        const response = await axios.post(cfgGithub.token_uri, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            params: {
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri
            }
        });

        console.log(response.data);
        res.redirect(`/github/account?token=${response.data.access_token}`);

    } catch (error) {
        console.error('Error de inicio de sesión en github:', error.message);
        res.send('Error de inicio de sesión en github');
    }
});


// Ruta de autenticación de Google
app.get('/account', async (req, res) => {
    const accessToken = req.query.token;
    try {
        // Utiliza el token de acceso para obtener la información del usuario
        const userResponse = await axios.get(cfgGithub.profile_uri, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userData = userResponse.data;
        console.log(userData);
        res.send(`<ul>
        <li>${userData.name}</li>
        <li><img src="${userData.avatar_url}" /></li>
        <li>Bio: ${userData.bio}</li>
        <li>Blog: ${userData.blog}</li>
        <li>Locale: ${userData.location}</li>
        <li>Email: ${userData.email}</li>
        <li><a href="/github/logout?token=${accessToken}" >logout</a></li>
        </ul>`);
    } catch (error) {
        console.error('Error de cuenta en github:', error.message);
        res.send('Error de cuenta en github');
    }
});

app.get('/logout', (req, res) => {
    const clientId = cfgGithub.client_id;
    const clientSecret = cfgGithub.client_secret;
    const accessToken = req.query.token;
    const token_uri = 'https://api.github.com/applications';
    const request_uri = `${token_uri}/${clientId}/token`;

    console.log(request_uri);

    axios.post(request_uri, null, {
        auth: {
            username: clientId,
            password: clientSecret
        },
        data: {
            access_token: accessToken
        }
    })
        .then(response => {
            console.log('Token de acceso revocado:', response.status);
        })
        .catch(error => {
            console.error('Error al revocar el token de acceso:', error.message);
        });
});

module.exports = app;