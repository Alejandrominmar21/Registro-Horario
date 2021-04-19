import {Router} from "express"; 
const router = Router()

import * as controladorUsers from '../controllers/users.controller.js'

//TODO Función para crear usuarios?

router.get('/users', controladorUsers.getUsers)

router.get('/user/:userId', controladorUsers.getUserById) //devuelve un usuario en concreto

router.patch('/user/:userId', controladorUsers.updateUserById) //Edita el nombre del usuario, los perfiles/roles


export default router;