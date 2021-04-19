import * as modeloUsers from '../models/users.model.js'

/**
 * @function
 * @description <pre>
 * Funcion pedir todos los usuarios. 
 * 
 * Esta función solo llama a otra que pasa los datos de todos los usuarios mediante un json.
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const getUsers = (req, res) => {
  modeloUsers.getUsers(res)
}

/**
 * @function
 * @description <pre>
 * Funcion que devuelve los datos del usuario que tenga la ID pasada por parametro. 
 * 
 * Esta función solo llama a otra  pasa los datos del usuario mediante un json.
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const getUserById = (req, res) => {
  modeloUsers.getUserById(req.params.userId, res) == true
}

/**
 * @function
 * @description <pre>
 * Funcion que actualiza los datos del usuario que tenga la ID pasada por parametro. 
 * 
 * Esta función encripta la contraseña pasada y después llama a la funcion del modelo que actualiza los datos del usuario.
 * </pre>
 * @param {Object} req 
 * @param {Object} res 
 */
export const updateUserById = (req, res) => {//TODO Esto debe editar aparte de los usuarios, los perfiles y los roles
  if (req.body.nombre != null, req.body.apellidos != null) {//TODO validar los datos 
    modeloUsers.updateUserById(req.body.nombre, req.body.apellidos, req.params.userId, res)
  } else {
    res.json({ result: "Faltan datos" })
  }
}
