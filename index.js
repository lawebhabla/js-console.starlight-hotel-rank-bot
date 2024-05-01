require('dotenv').config();
const noblox = require("noblox.js");
const express = require('express');
const app = express();

// Lectura de constantes de .env
let cookie = process.env.COOKIE;
let groupId = process.env.GROUP_ID;
const PORT = process.env.PORT || 8080;

noblox.setCookie(cookie).then(function(currentUser) {
    console.log(`Logged in as ${currentUser.UserName}`);

    app.get('/', async (req, res) => {
        // Obtenemos los parametros userId y rankId
        let userId = parseInt(req.query.userId);
        let rankId = parseInt(req.query.rankId);
    
        // Validacion de parametros obligatorios de la consulta
        if (isNaN(userId) || isNaN(rankId)) {
            return res.status(400).json({ error: 'Los parametros userId y rankId son obligatorios' });
        }
        else {
            noblox.setRank(groupId, userId, rankId)
            .then(() => {
                const message = `Establecido ranking ${rankId} para el usuario ${userId}`;
                res.send(message);
                console.log(message);
            })
            .catch((error) => {
                const message = `ERROR Estableciendo ranking ${rankId} para el usuario ${userId}: ${error.message}`;
                res.status(500).send(message);
                console.log(message);
            });
        }
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}).catch(function(err) {
    console.log("Unable to log in!", err)
})