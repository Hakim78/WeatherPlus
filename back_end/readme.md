Comment lancer le projet ?

Avant tout, il faut installer les dépendances de chaque service :

- cd user-service
- npm install

- cd ../
- cd favoris-service
- npm install

- cd ../
- cd api_getway
- npm install

- cd ../ Pour aller dans le dossier racine

à la racine des dossier de user-service et favoris-service, il faut créer un fichier .env avec les variables d'environnement :

Il faudra y déclarer le secret JWT, et le temps d'expiration du token JWT.

JWT_SECRET = ... (ex: azeiogherg)
JWT_EXPIRES_IN = ... (ex: 24h)

Dans le dossier ```api_getway```, il faut créer un fichier .env avec les variables d'environnement :	

GATEWAY_PORT=4000

Enfin, il faut lancer chaque service dans des consoles séparées pour qu'ils tournent en parallèle :

- cd user-service
- npm start


- cd favoris-service
- npm start


- cd api_getway
- npm start

Avec notre getway, tout nos services tournes sur le même port (défini dans le fichier .env de api_getway).