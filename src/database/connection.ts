import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// conectando
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@backendchalenge.byts9.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true }, () => console.log('connected to db'))

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Erro na conexão com o banco de dados:'))

export default db