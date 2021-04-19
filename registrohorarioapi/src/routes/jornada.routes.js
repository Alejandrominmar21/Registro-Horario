import {Router} from "express"; 
const router = Router()

import * as controladorRegistros from '../controllers/jornada.controller.js'

router.get('/jornada/:IDregistro', controladorRegistros.getJornadaById)

router.get('/jornadas', controladorRegistros.getJornadas)

router.put('/jornada', controladorRegistros.createJornada)

router.patch('/jornada', controladorRegistros.updateJornadaById)

router.post('/generarInforme/:IDuser', controladorRegistros.JornadasUserId)

router.post('/finalizarJornada/:IDuser', controladorRegistros.finalizarJornada)

//TODO cambiar esto, lo que es valido o no son los eventos(con el cambio que he hecho serían las restricciones?) asique tienes que cambiar esto y la funcion del modelo y del controlador
// router.delete('/jornada/:IDjornada', controladorRegistros.borrarJornada)

router.get('/jornadasMes/:IDuser', controladorRegistros.jornadasMes)

router.get('/jornadasAnio/:IDuser', controladorRegistros.jornadasAnio)

export default router;