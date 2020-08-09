// Importieren der npm-Pakete
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

// Server-Variablen
const { MONGODB, PORT } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/resolvers');

// Apollo-Server initalisieren
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: (req) => req,
});

// Verbindung zur mongoDB herstellen
mongoose
	.connect(MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Der Server ist mit MongoDB verbunden!');
		return server.listen(PORT, () =>
			console.log('Server wurde mit folgendem Port gestartet:', PORT)
		);
	})
	.catch((err) => {
		console.log(err);
	});
