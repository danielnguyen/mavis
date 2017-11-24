import express = require('express');

module.exports = function(app: express.Router) {
    app.get('/healthcheck', (req, res) => {
        const status = {
            message: "I'm online!"
        }
        res.send(JSON.stringify(status))
    })
}