const express = require('express');

// Load Express GraphQL
const expressGraphQL = require('express-graphql');

// Load GraphQL schema
const schema = require('./schema/schema');

const app = express();

// GraphQL Middleware
app.use('/graphql', expressGraphQL(
    {
        schema,
        graphiql: true
    }
));

app.listen(9999, () => {
    console.log('server is running 0n port 9999');
});