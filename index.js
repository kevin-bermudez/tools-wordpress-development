const dotenv = require('dotenv');
dotenv.config();
const { doQuestion } = require('./utils/do-question');
const path = require('path');
const fs = require('fs');
const passwordGenerator = require('generate-password');

const defaultProjectsPath = process.env.DEFAULT_PROJECTS_PATH;

const { toSnakeCase, toHyppenCase, toPascalCase } = require('./utils/to-cases');
const {
  createNewFile,
  copyFolder
} = require('./utils/manage-templates');
const { executeInConsole } = require('./utils/execute-in-console');
const { delay } = require('./utils/wait');
const { CliStrategy } = require('./wp/CliStrategy');
const { StrategyWithDocker } = require('./wp/StrategyWithDocker');
const { StrategyWithXampp } = require('./wp/StrategyWithXampp');


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

const copyPreinstalledPlugins = (projectPath) => {
  try {
    copyFolder(path.resolve(__dirname, 'templates/plugins'),path.resolve(projectPath, 'plugins'));
  }
  catch (error) {
    console.error('Falló copiando los plugins preinstalados', error);
    throw new Error('Falló copiando los plugins preinstalados');
  }
}

const setInitialConfigRepo = async (pathNewProject) => {
  try { 
    let ouput = await executeInConsole(`cd ${pathNewProject} && git init`);
    console.log('SALIDA PARA GIT INIT')
    console.log(ouput)

    ouput = await executeInConsole(`cd ${pathNewProject} && git config user.email "kevinbermudezmejia@gmail.com"`);
    console.log('SALIDA PARA GIT CONFIG EMAIL')
    console.log(ouput)

    ouput = await executeInConsole(`cd ${pathNewProject} && git config user.name "kevin-bermudez"`);
    console.log('SALIDA PARA GIT CONFIG NAME')
    console.log(ouput)
  }
  catch (error) {
    console.error('Falló git init, git config', error);
    throw new Error('Falló git init, git config');
  }
}

const npmI = async(pathNewProject) => {
  try{
    const output = await executeInConsole(`cd ${pathNewProject} && . $NVM_DIR/nvm.sh use && npm i`);
    console.log('SALIDA PARA npm i');
    console.log(output);
  }
  catch(error){
    console.error('Falló npm i', error);
    throw new Error('Falló npm i');
  }
}

const setBranchAndFirstCommitRepo = async (pathNewProject,repoUrl) => {
  try { 
    let ouput = await executeInConsole(`cd ${pathNewProject} && git remote add origin ${repoUrl}`);
    console.log('SALIDA PARA GIT REMOTE')
    console.log(ouput)

    ouput = await executeInConsole(`cd ${pathNewProject} && git add . && git commit -m "chore: initial commit" && git push -f origin master`);
    console.log('SALIDA PARA GIT COMMIT')
    console.log(ouput)

    ouput = await executeInConsole(`cd ${pathNewProject} && git push -f origin master`);
    console.log('SALIDA PARA GIT PUSH')
    console.log(ouput)
  }
  catch (error) {
    console.error('Falló git remote, git commit, git push', error);
    throw new Error('Falló git remote, git commit, git push');
  }
}

const main = async () => {
  console.log('Información para el nuevo proyecto');

  console.log()
  const projectName = await doQuestion('Nombre del proyecto:', true,'prueba');
  const withDocker = (await doQuestion('Con Docker? (s/n):',true,'s')).toLowerCase() === 's';
  
  const projecNamePascalCase = toPascalCase(projectName);
  const folderName = toHyppenCase(projectName);
  const projectSnakeCase = toSnakeCase(projectName);
  const pathNewProjectRoot = `${defaultProjectsPath}/${folderName}`
  const pathNewProject = withDocker ? `${pathNewProjectRoot}/code` : `${pathNewProjectRoot}/wp-content/themes/${folderName}`;
  

  if(withDocker){
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
  }


  let webPort,dbPort;
  webPort = await doQuestion('Puerto web:', true,8209);
  dbPort = await doQuestion('Puerto db:', true,8210);
  
  const currentTime = new Date().getTime();
  
  const webServiceName = `${projectSnakeCase}_web_${currentTime}`;
  const webContainerName = `${projectSnakeCase}_web_cont_${currentTime}`;
  
  const dbServiceName = `${projectSnakeCase}_db_${currentTime}`;
  const dbContainerName = `${projectSnakeCase}_db_cont_${currentTime}`;
  
  const cliServiceName = `${projectSnakeCase}_wpcli_${currentTime}`;
  const cliContainerName = `${projectSnakeCase}_wpcli_cont_${currentTime}`;

  const dbName = `${projectSnakeCase}_${currentTime}`;
  const dbUser = `${projectSnakeCase}_${currentTime}`;

  const networkName = `${projectSnakeCase}_network_${currentTime}`;
  

  let repoUrl = '';
  if (process.env.SKIP_CONFIG_REPO !== 'true') {
    repoUrl = await doQuestion('Url del repositorio:', true, 'git@kevin-bitbucket:wordpress-free/theme-wordpress-prueba.git');
  }

  const wordpressVersion = await doQuestion('Versión de wordpress:', true, '6.4');

  const webTitle = await doQuestion('Título de la web', true,'Probando Ando');
  const adminPassword = passwordGenerator.generate({
    length: 8,
    numbers: true
  })

  console.log('La clave de administrador es: ', adminPassword);
  
  if (process.env.SKIP_CREATE_PROJECT_FOLDER !== 'true') {
    createFolderProject(pathNewProjectRoot);
  }
  
  if (process.env.SKIP_DUPLICATE_FILES !== 'true' && withDocker) {
    duplicateFiles(getAllFiles(),pathNewProject,{
        DB_SERVICE_NAME: dbServiceName,
        DB_CONTAINER_NAME: dbContainerName,
        DB_NAME: dbName,
        DB_USER: dbUser,
        DB_PORT: dbPort,
        NETWORK_NAME: networkName,
        WEB_SERVICE_NAME: webServiceName,
        WEB_CONTAINER_NAME: webContainerName,
        CLI_SERVICE_NAME: cliServiceName,
        CLI_CONTAINER_NAME: cliContainerName,
        WEB_PORT: webPort,
        THEME_NAME: folderName,
        PROJECT_NAME_FOR_CSS_CLASS: folderName,
        PROJECT_NAME: projectName,
        PROJECT_NAME_PASCAL_CASE:projecNamePascalCase,
        REPO_URL: repoUrl,
        WORDPRESS_VERSION: wordpressVersion,
        SUFFIX_NAMES: currentTime,
        ADMIN_PASSWORD: adminPassword,
        WEB_TITLE: webTitle,
      },
      pathNewProject
    );
    copyPreinstalledPlugins(withDocker ? pathNewProjectRoot : `${pathNewProjectRoot}/wp-content`);
  }

  const cli = new CliStrategy();
  const cliImplementation = withDocker ? new StrategyWithDocker({ 
    pathNewProject,
    cliServiceName,
    folderName,
    webPort 
  }) : new StrategyWithXampp({ 
    pathNewProject: pathNewProjectRoot,
    folderName,
    webPort,
    webTitle,
    adminPassword,
    dbBin: process.env.DB_BIN,
    dbName
  });
  cli.setStrategy( cliImplementation );

  const installedWordpress = await cli.installWordpress();

  if(!installedWordpress){
    console.error('No se pudo instalar wordpress');
    throw new Error('No se pudo instalar wordpress');
  }
  
  console.log()
  console.log('WORDPRESS INSTALADO CON ÉXITO');

  if(!withDocker){
    duplicateFiles(getAllFiles(),pathNewProject,{
        DB_SERVICE_NAME: dbServiceName,
        DB_CONTAINER_NAME: dbContainerName,
        DB_NAME: dbName,
        DB_USER: dbUser,
        DB_PORT: dbPort,
        NETWORK_NAME: networkName,
        WEB_SERVICE_NAME: webServiceName,
        WEB_CONTAINER_NAME: webContainerName,
        CLI_SERVICE_NAME: cliServiceName,
        CLI_CONTAINER_NAME: cliContainerName,
        WEB_PORT: webPort,
        THEME_NAME: folderName,
        PROJECT_NAME_FOR_CSS_CLASS: folderName,
        PROJECT_NAME: projectName,
        PROJECT_NAME_PASCAL_CASE:projecNamePascalCase,
        REPO_URL: repoUrl,
        WORDPRESS_VERSION: wordpressVersion,
        SUFFIX_NAMES: currentTime,
        ADMIN_PASSWORD: adminPassword,
        WEB_TITLE: webTitle,
      },
      pathNewProject
    );
    copyPreinstalledPlugins(withDocker ? pathNewProjectRoot : `${pathNewProjectRoot}/wp-content`);
  }

  console.log();
  console.log('CAMBIANDO A IDIOMA ESPAÑOL');
  await cli.changeLanguage( 'es_ES' );
  // await changeLanguage(cliServiceName,pathNewProject,withDocker);

  console.log()
  console.log('ACTIVANDO TEMA')
  await cli.activateTheme();

  console.log()
  console.log('INSTALANDO PLUGINS')
  //install 
  await cli.installPlugin( 'duplicator' );
  await cli.installPlugin( 'form-maker' );
  // await installPlugin('duplicator', pathNewProject, cliServiceName, withDocker);
  // await installPlugin('form-maker', pathNewProject, cliServiceName, withDocker);

  // await installPlugin(`/var/www/html/wp-content/themes/${folderName}/plugins-pro/advanced-custom-fields-pro.zip`, pathNewProject, cliServiceName);

  console.log()
  console.log('ACTIVANDO PLUGINS')
  await cli.activatePlugin( 'duplicator advanced-custom-fields-pro form-maker' );
  // await activatePlugin('duplicator advanced-custom-fields-pro form-maker', pathNewProject, cliServiceName, withDocker);

  console.log()
  console.log('DESACTIVANDO PLUGINS')
  await cli.deactivatePlugin( 'akismet hello' );
  // await deactivatePlugin('akismet hello', pathNewProject, cliServiceName, withDocker);

  console.log()
  console.log('DESINSTALANDO PLUGINS')
  await cli.uninstallPlugin( 'akismet hello' );
  // await uninstallPlugin('akismet hello', pathNewProject, cliServiceName, withDocker);

  console.log()
  console.log('ELIMINANDO THEMES INACTIVOS')
  await cli.deleteInaciveThemes();
  // await deleteInaciveThemes(pathNewProject, cliServiceName, withDocker);

  if (process.env.SKIP_CONFIG_REPO !== 'true') {
    console.log()
    console.log('CONFIGURANDO EL REPO')
    await setInitialConfigRepo(pathNewProject);
    await setBranchAndFirstCommitRepo(pathNewProject, repoUrl);
  }

  if(withDocker){
    console.log();
    console.log('INSTALANDO DEPEDENCIAS DE NODE');
    await npmI(pathNewProject);
  }

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
