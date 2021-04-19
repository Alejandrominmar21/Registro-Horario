import * as modeloJornada from '../models/jornada.model.js'

/**
 * @function
 * @description <pre>
 * Funcion que devuelve los datos de la jornada que tenga la ID pasada por parametro. 
 * 
 * Esta función solo llama a otra pasa los datos de la jornada mediante un json.
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const getJornadaById = (req, res) => {
  if (req.params.id = ! null) {
    modeloJornada.getJornadaById(req.params.id, res)
  }
}

/**
 * @function
 * @description <pre>
 * Funcion que devuelve los datos de todas las jornadas. 
 * 
 * Esta función solo llama a otra  pasa los datos de las jornadas mediante un json.
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const getJornadas = (req, res) => {
  modeloJornada.getJornadas(res)
}

/**
 * @function
 * @description <pre>
 * Funcion para crear una jornada. 
 * 
 * Esta llama a la funcion del modelo que inserta los datos del registro.
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const createJornada = (req, res) => {
  if (req.body.IDUsuario != null) {
    modeloJornada.createJornada(req.body.IDUsuario, res)
  } else {
    res.json("Faltan datos")
  }
}

/**
 * @function
 * @description <pre>
 * Funcion que actualiza los datos de la jornada que tenga la ID pasada. 
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const updateJornadaById = (req, res) => {
  if (req.body.Id != null, req.body.TipoHora != null, req.body.Hora != null, req.body.MotivoEdicion != null) {//esto valida que están los datos necesarios
    modeloJornada.updateJornadaById(req.body.Id, req.body.TipoHora, req.body.Hora, req.body.MotivoEdicion, res)
  } else {
    res.json({ result: "Faltan datos" })
  }
}

/**
* @function
* @description <pre>
* Funcion que muestra los registros con la fecha de inicio y de fin pasadas del usuario
* 
* Esta función llama a la función del modelo que hara la consulta para mostrar los registros
* </pre>
* @param {Object} req 
* @param {Object} res 
*/
export const JornadasUserId = (req, res) => {
  if (req.params.IDuser != null) {
    modeloJornada.JornadasUserId(req.params.IDuser, req.body.HoraInicio, req.body.HoraFin, res)
  }
}


/**
 * @function
 * @description <pre>
 * Funcion que registra la hora a la que se ha terminado la jornada. 
 * 
 * Esta función lo único que hace es llamar a la función del modelo que actualizará el campo HoraFin con la fecha y hora actual
 * @param {Object} req 
 * @param {Object} res 
 */
export const finalizarJornada = (req, res) => {
  modeloJornada.finalizarJornada(req.params.IDuser, res)
}

/**
* @function
* @description <pre>
* Funcion pasa todos los registros de las jornadas de este mes y las horas totales.
*
* Esta funcion solo llama al modelo
* </pre>
* @param {Object} req 
* @param {Object} res 
*/
export const jornadasMes = (req, res) => {
  if (req.params.IDuser != null) {
    modeloJornada.jornadasMes(req.params.IDuser, res)
  }
}

/**
* @function
* @description <pre>
* Funcion pasa todos los registros de las jornadas de este año y las horas totales.
*
* Esta funcion solo llama al modelo
* </pre>
* @param {Object} req 
* @param {Object} res 
*/
export const jornadasAnio = (req, res) => {
  if (req.params.IDuser != null) {
    modeloJornada.jornadasAnio(req.params.IDuser, res)
  }
}