import mysql from 'mysql'

var con = mysql.createConnection({
    host: "localhost",
    user: "root",//TODO sacar en un fichero aparte, junto a la clave para generar los tokens con JsonWebToken que sería algo así: app.set('secretKey', 'ClaveSecreta');
    password: "",
    database: "registrohorarioapi"
});
  
con.connect(function(err) {
  if (err) throw err;
  console.log("Se ha conectado a la base de datos");
});

export default con