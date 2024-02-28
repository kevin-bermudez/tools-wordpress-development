const { exec } = require('child_process');
 
module.exports.executeInConsole = (command) => new Promise((res, rej) => {
  // Ejecutar el comando
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return rej(error);
      // console.error(`Error al ejecutar el comando: ${error.message}`);
    }
    if (stderr) {
      return rej(stderr);
      // console.error(`Error en la salida estándar del comando: ${stderr}`);
    }

    return res(stdout);
    // console.log(`Salida del comando:\n${stdout}`);
  });
})