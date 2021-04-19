import express from 'express'
import morgan from 'morgan'
import body_parser from 'body-parser'


import usersRoutes from './routes/user.routes.js'
import registroRoutes from './routes/jornada.routes.js'

const app = express()
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(morgan('dev'));

app.get('/', (req,res) => {
    res.json({result: "API Registro de Horarios"})
})

app.use(usersRoutes)
app.use(registroRoutes)

export default app

