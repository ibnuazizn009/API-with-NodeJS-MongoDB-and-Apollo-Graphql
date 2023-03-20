const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./schema/resolvers");
const { typeDefs } = require("./schema/type-defs");
const isAuthM = require('./middleware/auth');
dotenv.config();

app.use(isAuthM);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to codex-API");
});

const server = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    context: ({req}) => {
        let {isAuth} = req;
        return{
            req, 
            isAuth,
        }
    }
});

async function start() {

    await server.start();

    server.applyMiddleware({ app, path: "/codexapi", cors: true });
  
    app.listen(process.env.PORT, () => {
        console.log(`Server Running in ${process.env.PORT}`)
    });
}

const uri = `mongodb+srv://ibnuaziz09:${process.env.PASS}@cluster0.3yt2b.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', (error) => console.log('Error Connection',error))
db.once('open', () => console.log('Database Connected'))

start()