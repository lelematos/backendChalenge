import { ApolloServer, gql } from 'apollo-server'
import ArcAPI from './datasource/planet'
import typeDefs from './server/schemas'
import resolvers from './server/resolvers'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
// legal você ter utilizado o .env, facilita bastante :)
dotenv.config()

// conectando
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@backendchalenge.byts9.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connected to db'))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        arcAPI: new ArcAPI()
    })
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})