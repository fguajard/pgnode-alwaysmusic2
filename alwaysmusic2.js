const { Pool } = require("pg");

const args = process.argv.slice(2);

const config = {
  user: "postgres",
  host: "localhost",
  database: "alwaysmusic",
  password: "postgres",
  port: 5432,
  max: 20,
  min: 2,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

const consultarAlumnos = ()=>{
    return {
        text: "SELECT * from alumnos",        
        rowMode: "array",
        name: "fetch-alumnos",
      };
}

const insertarAlumno = (argumentos)=>{    
    return {
        text: "insert into alumnos values($2,$1,$3,$4) RETURNING *",
        values: argumentos,
        // rowMode: "array",
        name: "insertar-alumno",
      };
}

const actualizarAlumno = (argumentos)=>{    
    return {
        text: "update alumnos set nombre = $1, curso = $3, nivel = $4 where rut = $2 RETURNING *",
        values: argumentos,
        // rowMode: "array",
        name: "actualizar-alumno",
      };
}

const obtenerAlumnoEspecifico = (argumentos)=>{
    return {
        text: "select * from alumnos where rut = $1",
        values: argumentos,
        // rowMode: "array",
        name: "fetch-alumno-rut",
      };
}

const eliminarAlumno = (argumento)=>{
    return {
        text: "delete from alumnos where rut = $1 RETURNING *",
        values: argumento,
        // rowMode: "array",
        name: "fetch-eliminar-alumno",
      };
}

const funciones = {
    nuevo: insertarAlumno,
    consulta: consultarAlumnos,
    editar: actualizarAlumno,
    rut: obtenerAlumnoEspecifico,
    eliminar: eliminarAlumno,
  };

pool.connect(async (error_connection, client, release) => {
  
    const alwaysmusic2 = async ()=>{
    if (error_connection) return console.log(error_connection);
    try {
      const [operacion, ...argumentos] = args;
      const SQLQuery = funciones[operacion](argumentos);
      const result = await client.query(SQLQuery);
      const resultadoFinal = result.rows.length > 1 ? result.rows: result.rows[0]
      console.log(resultadoFinal);
    } catch (error_consulta) {
      console.log(error_consulta.code, error_consulta.detail);
    } finally {
      release();
      pool.end();
    }
  }
  alwaysmusic2()
});
