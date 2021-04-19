import conexion from '../database.js'
import excel from 'excel4node'

/**
 * @function
 * @description <pre>
 * Funcion para listar la jornada con el id pasado 
 * 
 * Esta función hace la consulta para listar el registro con el id pasado y manda un json con el resultado
 * </pre>
 * @param {id} id
 * @param {Object} res 
 */
export const getJornadaById = (id, res) => {
    conexion.connect(function (err) {
        conexion.query("SELECT * FROM jornada WHERE id =" + id, function (err, result, fields) {
            if (err) res.json(err);
            console.log(result);
            res.json(result)
        });
    });
}

/**
 * @function
 * @description <pre>
 * Funcion para listar el usuario con el id pasado 
 * 
 * Esta función hace la consulta para listar el registro con el id pasado y manda un json con el resultado
 * </pre>
 * @param {Object} res 
 */
export const getJornadas = (res) => {
    conexion.connect(function (err) {
        conexion.query("SELECT * FROM jornada", function (err, result, fields) {
            if (err) res.json(err);
            console.log(result);
            res.json(result)
        });
    });
}

/**
 * @function
 * @description <pre>
 * Funcion para crear una jornada. 
 * 
 * Esta función hace tres consultas a la base de datos, primero mira si existe alguna jornada activa, en el caso de que no haya ninguna pregunta cual es el último id para después 
 * poder asignar el siguiente, y después crea la jornada con el idpasado. (la base de datos al crearla le asigna a hora inicio la fecha y hora)
 * </pre>
 * @param {Interger} IDUsuario 
 * @param {Object} res 
 */
export const createJornada = (IDUsuario, res) => {
    conexion.query("SELECT * FROM jornada WHERE IDUsuario =" + IDUsuario + " AND HoraFin IS NULL", function (err, result) {//Mira las jornadas activas(no debe encontrar ninguna)
        if (err) res.json(err);
        if (result.length == 0) {
            conexion.query("SELECT * FROM jornada WHERE Id = (SELECT MAX(Id) FROM jornada)", function (err, result) {//aqui saco el ultimo id para poder después asignar el siguiente
                if (err) res.json(err);
                if (result.length == 0)//Si no hay jornadas el id será 1
                    var siguienteId = 1
                else{
                    let respuestaObj = JSON.parse(JSON.stringify(result[0]));
                    var siguienteId = respuestaObj.Id + 1
                }   
                conexion.query("INSERT INTO jornada(Id, IDUsuario) VALUES (" + siguienteId + ", '" + IDUsuario + "')", function (err, result) {
                    if (err) res.json(err);
                    console.log(result);
                    res.json("Has empezado una jornada")
                });
            });
        } else {
            res.json("No puedes empezar una jornada cuando tienes una activa")
        }
    });

}

/**
 * @function
 * @description <pre>
 * Funcion para actualizar el registro que tenga el id pasado. 
 * 
 * Esta función hace la consulta para actualizar el registro que tenga el id pasado.
 * </pre>
 * @param {Object} res 
 * @param {Interger} Id 
 * @param {String} TipoHora 
 * @param {Timestamp} Hora 
 * @param {String} MotivoEdicion 
 */
export const updateJornadaById = (Id, TipoHora, Hora, MotivoEdicion, res) => {
    conexion.connect(function (err) {
        if (TipoHora == "Hora inicio") {
            conexion.query("UPDATE jornada SET HoraInicioEditada ='" + Hora + "', MotivoEdicion ='" + MotivoEdicion + "' WHERE Id =" + Id, function (err, result, fields) {
                if (err) res.json(err);
                console.log(result);
                res.json("Registro editado correctamente")
            });
        }
        else if (TipoHora == "Hora fin") {
            conexion.query("UPDATE jornada SET HoraFinEditada ='" + Hora + "', MotivoEdicion ='" + MotivoEdicion + "' WHERE Id =" + Id, function (err, result, fields) {
                if (err) res.json(err);
                console.log(result);
                res.json("Registro editado correctamente")
            });
        }
        else res.json("Debe de introducir un tipo de hora correcto")
    });
}

/**
 * @function
 * @description <pre>
 * Funcion que hace una consulta las jornadas con la fecha de inicio y de fin pasadas del usuario y despues las pasa a la funcion CrearExcel()
 * 
 * Esta función primero comprueba los datos que tiene, si se le pasa la hora de inicio  y la de fin se filtrará sacando las consultas que tengan una hora
 * de inicio mayor o igual a la pasada y una hora menor o igual a la hora de fin pasada. Si solo se le pasa hora de inicio lo hara solo con la hora de inicio,
 * si solo se pasa la de fin filtrará solo con la de fin y en el caso de que no se le pase nada no filtrará por horas
 * </pre>
 * 
 * @param {Interger} id 
 * @param {Timestamp} HoraInicio 
 * @param {Timestamp} HoraFin 
 * @param {Object} res 
 */ //TODO NOTA: Ahora mismo las filtraciones por horas no funcionarían si se ha editado la hora ya que se guarda en otro campo
export const JornadasUserId = (id, HoraInicio, HoraFin, res) => {
    if (HoraInicio != undefined && HoraFin != undefined) {
        console.log("Haciendo consulta de jornadas filtradas con hora inicio y fin")
        conexion.connect(function (err) {
            conexion.query("SELECT u.Nombre, u.Apellidos,j.* FROM jornada j INNER JOIN usuario AS u ON u.Id=j.IDUsuario WHERE HoraInicio  >='" + HoraInicio + "' AND HoraFin <= '" + HoraFin + "' AND IDUsuario = " + id + " ORDER BY j.HoraInicio", function (err, result) {
                if (err) res.json(err);
                crearExcel(result, res)
            });
        });
    } else if (HoraInicio != undefined) {
        console.log("Haciendo consulta de jornadas filtradas hora inicio")
        conexion.connect(function (err) {
            conexion.query("SELECT u.Nombre, u.Apellidos,j.* FROM jornada j INNER JOIN usuario AS u ON u.Id=j.IDUsuario WHERE HoraInicio >= '" + HoraInicio + "' AND IDUsuario = " + id + " ORDER BY j.HoraInicio", function (err, result) {
                if (err) res.json(err);
                crearExcel(result, res)
            });
        });
    } else if (HoraFin != undefined) {
        console.log("Haciendo consulta de jornadas filtradas con hora fin")
        conexion.connect(function (err) {
            conexion.query("SELECT u.Nombre, u.Apellidos,j.* FROM jornada j INNER JOIN usuario AS u ON u.Id=j.IDUsuario WHERE HoraFin  <= '" + HoraFin + "' AND IDUsuario = " + id + " ORDER BY j.HoraInicio", function (err, result) {
                if (err) res.json(err);
                crearExcel(result, res)
            });
        });
    } else {
        console.log("Haciendo consulta de jornadas sin filtros")
        conexion.connect(function (err) {
            conexion.query("SELECT  u.Nombre, u.Apellidos,j.* FROM jornada j INNER JOIN usuario AS u ON u.Id=j.IDUsuario WHERE IDUsuario = " + id + " ORDER BY j.HoraInicio", function (err, result) {
                if (err) res.json(err);
                crearExcel(result, res)
            });
        });
    }
}

/**
 * @function
 * @description <pre>
 * Función para finalizar las jornadas activas de los usuarios
 * 
 * Esta función primero hace una consulta para comprobar que existe una jornada para ese usuario sin la hora fin, despúes obtiene la hora actual 
 * y actualiza la jornada añadiendole a la hora fin el tiempo actual.
 *  
 * </pre>
 * @param {Object} res 
 * @param {Interger} IDUsuario
 */
export const finalizarJornada = (IDUsuario, res) => {
    conexion.connect(function (err) {//La primera consulta busca una jornada que tenga el id del usuario y que no tenga hora fin
        conexion.query("SELECT * FROM jornada WHERE IDUsuario =" + IDUsuario + " AND HoraFin IS NULL", function (err, result) {
            if (err) res.json(err);
            if (result.length == 1) {// Tiene que devolver siempre una columna ya que si devuelve mas habría mas de una jornada activa  y si devuelve 0 no habría ninguna
                let respuestaObj = JSON.parse(JSON.stringify(result[0]));
                //Esto lo que hace es coger la fecha actual y formatearla a un String como mysql lo necesita
                let fechaActual = new Date(Date.now())
                let fechaFormateada = fechaActual.getFullYear() + "-" + ("0" + (fechaActual.getMonth() + 1)).slice(-2) + "-" + ("0" + fechaActual.getDate()).slice(-2) + " " + fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getMinutes()

                conexion.query("UPDATE jornada SET Horafin = '" + fechaFormateada + "' WHERE Id =" + respuestaObj.Id, function (err, result, fields) {
                    if (err) res.json(err);
                    console.log(result);
                    res.json("Has finlizado la jornada")
                });
            } else if (result.length == 0) {
                res.json("No existe ninguna jornada activa de este usuario")
            } else {
                res.json("Error: Existe más de una jornada activa")
            }
        });
    });
}

//TODO Asegurarse de que el tema de las horas funciona bien
//TODO No tiene en cuenta las horas editadas
//TODO No se restan las interrupciones, se deberían restar? o cuenta como horas trabajadas?

/**
 * @function
 * @description <pre>
 * Funcion pasa todos los registros de las jornadas de este mes.
 * 
 * Esta funcion hace una consulta a la base de datos filtrando las jornadas que empiecen desde el dia 1 del mes hasta el 1 del mes siguiente
 * después por cada jornada saca las horas restando la hora de inicio y la de fin.
 * </pre>
 * @param {Interger} id 
 * @param {Object} res 
 */
export const jornadasMes = (id, res) => {
    let fechaActual = new Date(Date.now())
    let inicioMes = fechaActual.getFullYear() + "-" + ("0" + (fechaActual.getMonth() + 1)).slice(-2) + "-" + 1 + " 00:00:00"
    let MesSiguiente = fechaActual.getFullYear() + "-" + ("0" + (fechaActual.getMonth() + 2)).slice(-2) + "-" + 1 + " 00:00:00"

    conexion.connect(function (err) {
        conexion.query("SELECT * FROM jornada WHERE HoraInicio  >='" + inicioMes + "' AND HoraInicio < '" + MesSiguiente + "' AND IDUsuario = " + id, function (err, result, fields) {
            if (err) res.json(err);

            let RecuentoHoras = 0
            result.forEach(jornada => {
                // Esto está hecho con los milisegundos porque si saco directamente las horas por ejemplo si empieza a las 9:59 y finaliza a las 10:00
                // le contaría como una hora trabajada, entonces es mas exacto restar los milisegundos y pasarlos a horas y minutos
                if (jornada.HoraFin != null) {
                    var Milisegundostrabajados = jornada.HoraFin.getTime() - jornada.HoraInicio.getTime()
                    var horas = ((Milisegundostrabajados / 1000) / 60) / 60
                    RecuentoHoras += horas
                }
            });

            let minutos = Math.round((RecuentoHoras - Math.round(RecuentoHoras)) * 60)
            RecuentoHoras = Math.round(RecuentoHoras)
            res.json({ Result: result, tiempototal: RecuentoHoras + " horas y " + minutos + " minutos" })
        });
    });
}

/**
 * @function
 * @description <pre>
 * Funcion pasa todos los registros de las jornadas de este año y las horas totales.
 * 
 * Esta funcion hace una consulta a la base de datos filtrando las jornadas que empiecen desde el dia 1 del mes hasta el 1 del mes siguiente
 * después por cada jornada saca las horas restando la hora de inicio y la de fin.
 * </pre>
 * @param {Interger} id 
 * @param {Object} res 
 */
export const jornadasAnio = (id, res) => {
    let fechaActual = new Date(Date.now())
    let inicioAnio = fechaActual.getFullYear() + "-" + 1 + "-" + 1 + " 00:00:00"
    let anioSiguiente = (fechaActual.getFullYear() + 1) + "-" + 1 + "-" + 1 + " 00:00:00"
    console.log(anioSiguiente)
    conexion.connect(function (err) {
        conexion.query("SELECT * FROM jornada WHERE HoraInicio  >='" + inicioAnio + "' AND HoraInicio < '" + anioSiguiente + "' AND IDUsuario = " + id, function (err, result, fields) {
            if (err) res.json(err);

            let RecuentoHoras = 0
            result.forEach(jornada => {
                // Esto está hecho con los milisegundos porque si saco directamente las horas por ejemplo si empieza a las 9:59 y finaliza a las 10:00
                // le contaría como una hora trabajada, entonces es mas exacto restar los milisegundos y pasarlos a horas y minutos
                if (jornada.HoraFin != null) {
                    var Milisegundostrabajados = jornada.HoraFin.getTime() - jornada.HoraInicio.getTime()
                    var horas = ((Milisegundostrabajados / 1000) / 60) / 60
                    RecuentoHoras += horas
                }
            });

            let minutos = Math.round((RecuentoHoras - Math.round(RecuentoHoras)) * 60)
            RecuentoHoras = Math.round(RecuentoHoras)
            res.json({ Result: result, tiempototal: RecuentoHoras + " horas y " + minutos + " minutos" })
        });
    });
}

/**
 * @function
 * @description <pre>
 * Funcion que genera un archivo excel
 * 
 * Esta funcion crea un documento excel, en la carpeta base de la api, creando una fila por cada jornada pasada.
 * </pre>
 * @param {Object} jornadas 
 * @param {Object} res 
 */
function crearExcel(jornadas, res) {
    var wb = new excel.Workbook();
    var ws = wb.addWorksheet('Jornadas');

    var style = wb.createStyle({
        font: {
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
        fill: {
            type: "gradient",
            bgColor: "#2E64FE"
        },
    });
    var CabeceraStyle = wb.createStyle({
        font: {
            size: 12,
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '819ff7',
        }
    });
    var style2 = wb.createStyle({
        font: {
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: 'e6e6e6',
        }
    });

    ws.cell(1, 1).string("Nombre").style(CabeceraStyle);
    ws.cell(1, 2).string("Apellidos").style(CabeceraStyle);
    ws.cell(1, 3).string("Hora de inicio").style(CabeceraStyle);
    ws.cell(1, 4).string("Hora de fin").style(CabeceraStyle);
    ws.cell(1, 5).string("Hora editada").style(CabeceraStyle);
    ws.cell(1, 6).string("Hora de inicio editada").style(CabeceraStyle);
    ws.cell(1, 7).string("Hora de fin editada").style(CabeceraStyle);

    var contadorCelda = 2
    jornadas.forEach(jornada => {
        ws.cell(contadorCelda, 1).string(jornada.Nombre).style(style);
        ws.cell(contadorCelda, 2).string(jornada.Apellidos).style(style2);
        ws.cell(contadorCelda, 3).string(jornada.HoraInicio.toLocaleDateString() + " " + jornada.HoraInicio.toLocaleTimeString()).style(style);
        ws.cell(contadorCelda, 4).string(jornada.HoraFin.toLocaleDateString() + " " + jornada.HoraFin.toLocaleTimeString()).style(style2);

        if (!jornada.MotivoEdicion) {
            ws.cell(contadorCelda, 5).string("No").style(style);
            ws.cell(contadorCelda, 6).string("").style(style2);
            ws.cell(contadorCelda, 7).string("").style(style);
        } else {
            ws.cell(contadorCelda, 5).string(jornada.MotivoEdicion).style(style);
            
            if (jornada.HoraInicioEditada)
                ws.cell(contadorCelda, 6).string(jornada.HoraInicioEditada.toLocaleDateString() + " " + jornada.HoraInicioEditada.toLocaleTimeString()).style(style2);
            else
                ws.cell(contadorCelda, 6).string("").style(style2);

            if (jornada.HoraFinEditada)
                ws.cell(contadorCelda, 7).string(jornada.HoraFinEditada.toLocaleDateString() + " " + jornada.HoraFinEditada.toLocaleTimeString()).style(style);
            else
                ws.cell(contadorCelda, 7).string("").style(style);
        }

        contadorCelda++
    });

    wb.write('Informe jornadas.xlsx');

    res.json("Excel generado")
}
