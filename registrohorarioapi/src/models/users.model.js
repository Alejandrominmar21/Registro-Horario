import conexion from '../database.js'
var acomuladorUsuarios = []//Esta variable la uso para sacar los usuarios de las consultas a las bases de datos que hago en getUsers()

/**
 * @function
 * @description <pre>
 * Funcion para listar los usuarios, los perfiles y los permisos. 
 * 
 * Esta función hace la consulta para listar los usuarios y luego por cada usuario hace una consulta para los perfiles y otra para los permisos
 * y va mandando los datos de cada usuario a un acomulador que después se manda como respuesta.
 * </pre>
 * 
 * @param {Object} res 
 */
export const getUsers = (res) => {//TODO  Mirar por qué la primera vez que se ejecuta no responde nada y después sí
    conexion.connect(function (err) {
        conexion.query("SELECT DISTINCT Nombre, Apellidos FROM usuario", function (err, result, field) {
            if (err) res.json(err)
            result.forEach(usuario => {
                conexion.query("SELECT p1.Denominacion AS Perfil FROM usuario u INNER JOIN perfil AS p1 ON u.Id=p1.IDUsuario WHERE u.Nombre = '" + usuario.Nombre + "' AND u.Apellidos = '" + usuario.Apellidos + "'", function (err, resultPerfiles, fields) {
                    conexion.query("SELECT p2.Denominacion AS Permiso FROM usuario u INNER JOIN perfil AS p1 ON u.Id=p1.IDUsuario INNER JOIN permisos AS p2 ON p1.Id=p2.IDPerfil WHERE u.Nombre = '" + usuario.Nombre + "' AND u.Apellidos = '" + usuario.Apellidos + "'", function (err, resultPermisos, fields) {
                        var usuarioArray = [usuario.Nombre, usuario.Apellidos, "", ""]
                        resultPerfiles.forEach(resultado => {
                            usuarioArray[2] += resultado.Perfil + ", "
                        });
                        resultPermisos.forEach(resultado => {
                            usuarioArray[3] += resultado.Permiso + ", "
                        });
                        añadirUsuarioAcomulador(usuarioArray)
                    });
                });
            });
            res.json(acomuladorUsuarios); 
            acomuladorUsuarios = []
        });
    });
}

/**
 * @function
 * @description <pre>
 * Funcion para listar el usuario con el id pasado 
 * 
 * Esta función hace la consulta para listar el usuario con el id pasado y manda un json con el resultado
 * </pre>
 * @param {Object} res 
 * @param {Interger} userId
 */
export const getUserById = (userId, res) => {
    conexion.connect(function (err) {
        conexion.query("SELECT * FROM usuario WHERE id =" + userId, function (err, result, fields) {
            if (err) res.json(err);
            console.log(result);
            res.json(result)
        });
    });
}

/**
 * @function
 * @description <pre>
 * Funcion para listar el usuario que tenga el id pasado. 
 * 
 * Esta función hace la consulta para listar el usuario que tenga el id pasado.
 * </pre>
 * @param {String} nombre
 * @param {String} apellidos
 * @param {Interger} userId
 * @param {Object} res 
 */
export const updateUserById = (nombre, apellidos, userId, res) => {
    conexion.connect(function (err) {
        conexion.query("UPDATE usuario SET Nombre = '" + nombre + "', Apellidos ='" + apellidos + "' WHERE Id = " + userId, function (err, result) {
            if (err) res.json(err);
            console.log(result);
            res.json("Usario editado correctamente")
        });
    });
}

function añadirUsuarioAcomulador(DatosUsuario) {
    acomuladorUsuarios.push(DatosUsuario)
}
