const dotenv = require('dotenv');
dotenv.config();
const { doQuestion } = require('./utils/do-question');
const path = require('path');
const fs = require('fs');
const passwordGenerator = require('generate-password');

const defaultProjectsPath = process.env.DEFAULT_PROJECTS_PATH;

const { folderSelector, selector } = require('./utils/selectors');
const { toSnakeCase, toHyppenCase, toCamelCase } = require('./utils/to-cases');
const {
  getParsedTemplate,
  createNewFile,
  copyFile
} = require('./utils/manage-templates');
const { executeInConsole } = require('./utils/execute-in-console');
// const { getJsonFromYaml } = require('tools/utils/get-json-from-yaml');
const appDir = path.resolve(__dirname, '../../src');
const rootDir = path.resolve(__dirname, '../..');

const FlowTypesList = Object.freeze({
  CREATE: 'create',
  UPDATE: 'update'
});

const createFolderProject = (path) => {
  try {
    fs.mkdirSync(path);
  }
  catch (error) {
    console.error('Falló la creación de la carpeta del proyecto', error);
    throw new Error('Falló la creación de la carpeta del proyecto');
  }
}

const getUsedPorts = () => {
  try {
    const content = fs.readFileSync(process.env.USED_PORTS_PATH, 'utf-8');
    return JSON.parse(content);
  }
  catch (error) {
    console.error('Falló obteniendo el archivo de puertos usados', error);
    throw new Error('Falló obteniendo el archivo de puertos usados');
  }
}

const getAllFiles = (path = './templates/theme') => {
  const files = fs.readdirSync(path);
  const returned = {files:[],children:{}}
  const returnedFiles = [];
  const returnedFolders = [];

  files.forEach(file => {
    if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
      returned.children[`${path}/${file}`] = getAllFiles(`${path}/${file}`)
      return;
    }

    returned.files.push(`${path}/${file}`);
  })

  return returned;
}

const duplicateFiles = (info,path,data,pathRoot) => {
  try { 
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    info.files.forEach(file => {
      const templatePath = file.replace('./templates/','');
      const newPath = file.replace('./templates/theme',pathRoot);
      
      createNewFile(templatePath, newPath, data);
    })

    if (info.children && Object.keys(info.children).length) {
      Object.keys(info.children).forEach(key => {
        const pathNext = key.replace('./templates/theme', pathRoot);
        duplicateFiles(info.children[key], pathNext, data,pathRoot);
      })
    }
  }
  catch (error) {
    console.error('Falló duplicando files', error);
    throw new Error('Falló duplicando files');
  }
}

const copyWordpressInit = (pathNewProject) => {
  try {
    copyFile('wordpress.ini',`${pathNewProject}/wordpress.ini`,)
  }
  catch (error) {
    console.error('Falló copiando wordpress.ini', error);
    throw new Error('Falló copiando wordpress.ini');
  }
}

const main = async () => {
  console.log('Información para el nuevo proyecto');

  console.log()
  const projectName = await doQuestion('Nombre del proyecto:', true,'prueba');
  const folderName = toHyppenCase(projectName);
  const projectSnakeCase = toSnakeCase(projectName);
  const pathNewProjectRoot = `${defaultProjectsPath}/${folderName}`
  const pathNewProject = `${pathNewProjectRoot}/code`

  console.log();
  console.log('Puertos usados');
  console.log();

  getUsedPorts().forEach((portItem, index) => {
    console.log();
    console.log(portItem.name);
    portItem.ports.forEach(port => {
      console.log('--', port);
    })
  });

  const webPort = await doQuestion('Puerto web:', true,8103);
  const dbPort = await doQuestion('Puerto db:', true,3324);
  const currentTime = new Date().getTime();
  
  const webServiceName = `${projectSnakeCase}_web_${currentTime}`;
  const webContainerName = `${projectSnakeCase}_web_cont_${currentTime}`;
  
  const dbServiceName = `${projectSnakeCase}_db_${currentTime}`;
  const dbContainerName = `${projectSnakeCase}_db_cont_${currentTime}`;

  const toolboxServiceName = `${projectSnakeCase}_toolbox_wp_${currentTime}`;
  const toolboxContainerName= `${projectSnakeCase}_toolbox_wp_${currentTime}`;

  const dbName = `${projectSnakeCase}_${currentTime}`;
  const dbUser = `${projectSnakeCase}_${currentTime}`;

  const networkName = `${projectSnakeCase}_network_${currentTime}`;

  const repoUrl = await doQuestion('Url del repositorio:', true, 'a');
  const wordpressVersion = await doQuestion('Versión de wordpress:', true, '6.4');
  
  const webTitle = await doQuestion('Título de la web', true);
  const adminPassword = passwordGenerator.generate({
    length: 8,
    numbers: true
  })

  console.log('La clave de administrador es: ', adminPassword);
  
  if (process.env.SKIP_CREATE_PROJECT_FOLDER !== 'true') {
    createFolderProject(pathNewProjectRoot);
  }
  
  if (process.env.SKIP_DUPLICATE_FILES !== 'true') {
    duplicateFiles(getAllFiles(),pathNewProject,{
        DB_SERVICE_NAME: dbServiceName,
        DB_CONTAINER_NAME: dbContainerName,
        DB_NAME: dbName,
        DB_USER: dbUser,
        DB_PORT: dbPort,
        NETWORK_NAME: networkName,
        WEB_SERVICE_NAME: webServiceName,
        WEB_CONTAINER_NAME: webContainerName,
        WEB_PORT: webPort,
        THEME_NAME: folderName,
        PROJECT_NAME_FOR_CSS_CLASS: folderName,
        PROJECT_NAME: projectName,
        REPO_URL: repoUrl,
        WORDPRESS_VERSION: wordpressVersion,
        TOOLBOX_SERVICE_NAME: toolboxServiceName,
        TOOLBOX_CONTAINER_NAME: toolboxContainerName,
        SUFFIX_NAMES: currentTime,
        ADMIN_PASSWORD: adminPassword,
        WEB_TITLE: webTitle
      },
      pathNewProject
    );
  }

  console.log('Levantando containers de Docker...')
  const runDocker = await executeInConsole(
    `cd ${pathNewProject} && docker-compose up --build -d`
  );
  console.log('run docker is', runDocker);


  
  return true;
};

main()
  .then((success) => {
    console.log('Success executing process', success);
    process.exit();
  })
  .catch((error) => {
    console.error('Error executing process', error);
    process.exit();
  });

/*
  PASOS PARA CREAR UN FLUJO
  
  1. Crear domain, handler en la carpeta src/flows/{nameFolder}/domain src/flows/{nameFolder}/handler
  2. Modificar el archivo: src/flows/{nameFolder}/index.yml y agregar el flujo
*/
