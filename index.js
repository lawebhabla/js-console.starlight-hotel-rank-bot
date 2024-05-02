require('dotenv').config();
const noblox = require("noblox.js");
const express = require('express');
const app = express();

// Lectura de constantes de .env
let cookie = process.env.COOKIE;
let groupId = process.env.GROUP_ID;
const PORT = process.env.PORT || 8080;

// Establece el ranking de un usuario
async function setRankingUsuario(groupId, userId, rankId) {
    try {
        await noblox.setRank(groupId, userId, rankId);
        return {
            success: true,
            message: `Establecido correctamente el ranking ${rankId} al usuario ${userId}`
        };
    } catch (error) {
        return {
            success: false,
            message: `ERROR Estableciendo el ranking ${rankId} al usuario ${userId}: ${error.message}`
        };
    }
}

// Establece el ranking de una lista de usuarios separados por comas
async function setRankingListaUsuarios(groupId, userIdList, rankId) {
    const resultados = [];   
    const usuarios = userIdList.split(',');

  // Recorrer la lista y establecer el ranking para cada usuario
  for (const userId of usuarios) {
    const result = await setRankingUsuario(groupId, parseInt(userId), rankId);
    resultados.push(result);
  }

  return { 
    success: resultados.every(result => result.success), 
    message: resultados
  };
}

noblox.setCookie(cookie).then(function(currentUser) {
    console.log(`Logged in as ${currentUser.UserName}`);

    // Seteo de ranking concreto a userId concreto
    app.get('/user/:userid/rank/:rankid', async (req, res) => {
        const userId = parseInt(req.params.userid);
        const rankId = parseInt(req.params.rankid);

        // Validacion de parametros obligatorios de la consulta
        if (isNaN(userId) || isNaN(rankId)) {
            return res.status(400).json({ error: 'Los parametros userId y rankId son obligatorios' });
        }
        else {
            // Seteamos el ranking al usuario
            const result = await setRankingUsuario(groupId, userId, rankId);
            res.status(result.success ? 200 : 500).json(result);
        }        
    });

    // Seteo de ranking concreto a una lista de usersIds separados por comas
    app.get('/users/:useridlist/rank/:rankid', async (req, res) => {
        const userIdList = req.params.useridlist;
        const rankId = parseInt(req.params.rankid);

        // Validacion de parametros obligatorios de la consulta
        if (isNaN(rankId)) {
            return res.status(400).json({ error: 'Los parametros users y rankId son obligatorios' });
        }
        else {
            // Seteamos el ranking al usuario
            const result = await setRankingListaUsuarios(groupId, userIdList, rankId);
            res.status(result.success ? 200 : 500).json(result);
        }   
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}).catch(function(err) {
    console.log("Unable to log in!", err)
})