// Importieren der npm-Pakete
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

// Server-Variablen
const { MONGODB, PORT } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/resolvers');

// Express initalisieren
const app = express();

// Apollo-Server initalisieren
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: req => req
});

// Apollo-Server wird mit Express verbunden
server.applyMiddleware({ app, path: '/graphql', cors: true });

// Verbindung zur mongoDB herstellen
mongoose
	.connect(MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('mongoDB ist verbunden!');
		app.listen(PORT, () => {
			console.log(`🚀 Der Server steht unter folgenden Port bereit: ${PORT}`);
		});
	})
	.catch(err => {
		console.log(err);
	});
