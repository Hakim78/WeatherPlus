const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Service Map pour le routage dynamique
const serviceMap = {
  user: "http://localhost:3004/user",
  favoris: "http://localhost:3005/favoris",
};


// Middleware dynamique
app.use("/:service", (req, res, next) => {
  const serviceName = req.params.service;
  const target = serviceMap[serviceName];
  console.log(serviceName, target);

  if (target) {
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: "debug",
    })(req, res, next);
  } else {
    res.status(502).send(`Service ${serviceName} non disponible.`);
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Gateway API démarrée sur le port ${PORT}`);
  console.log('Services enregistrés :', Object.keys(serviceMap));
});
