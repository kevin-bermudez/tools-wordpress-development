const { exec } = require('child_process');
 
module.exports.executeInConsole = (command) => new Promise((res, rej) => {
  // Ejecutar el comando
  exec(command, (error, stdout, stderr) => {
    // console.log('error holis command', error, stdout, stderr);
    if (error) {
      // console.error(`Error al ejecutar el comando: ${error.message}`);
      return rej(error);
    }

    console.log(stderr);
    // if (stderr) {
    //   console.error(`Error en la salida estándar del comando: ${stderr}`);
    //   return rej(stderr);
    // }

    return res(stdout);
    // console.log(`Salida del comando:\n${stdout}`);
  });
})