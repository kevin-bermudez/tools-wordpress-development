const dotenv = require('dotenv');
dotenv.config();
const { doQuestion } = require('./utils/do-question');
const path = require('path');
const fs = require('fs');
const passwordGenerator = require('generate-password');

const defaultProjectsPath = process.env.DEFAULT_PROJECTS_PATH;

const { toSnakeCase, toHyppenCase } = require('./utils/to-cases');
const {
  createNewFile,
  copyFolder
} = require('./utils/manage-templates');
const { executeInConsole } = require('./utils/execute-in-console');
const { delay } = require('./utils/wait');


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

const wpIsInstalled = async (port, themeName,) => {
  try {
    const response = await fetch(`http://localhost:${port}/wp-content/themes/${themeName}/test-installed.php`);
    const body = await response.text()
    return body === 'true';
  }
  catch (error) {
    return false
  }
} 
  
const activateTheme = async (cliServiceName,themeName,pathNewProject) => {
  try { 
    const activatingTheme = await executeInConsole(
      `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp theme activate ${themeName}`
    );
    console.log('SALIDA ACTIVANDO EL TEMA', themeName);
    console.log(activatingTheme);
  }
  catch (error) {
    console.error('Falló activando el tema', error);
    throw new Error('Falló activando el tema');
  }
}

const installPlugin = async (plugin,pathNewProject,cliServiceName) => {
  try { 
    const installingPlugin = await executeInConsole(
      `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp plugin install ${plugin}`
    );
    console.log('SALIDA INSTALANDO EL PLUGIN', plugin);
    console.log(installingPlugin);
  }
  catch (error) {
    console.error('Falló instalando el plugin', error);
    throw new Error('Falló instalando el plugin');
  }
}

const activatePlugin = async (plugin,pathNewProject,cliServiceName) => {
  try { 
    const installingPlugin = await executeInConsole(
      `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp plugin activate ${plugin}`
    );
    console.log('SALIDA ACTIVANDO EL PLUGIN', plugin);
    console.log(installingPlugin);
  }
  catch (error) {
    console.error('Falló activando el plugin', error);
    throw new Error('Falló activando el plugin');
  }
}

const uninstallPlugin = async (plugin,pathNewProject,cliServiceName) => {
  try { 
    const installingPlugin = await executeInConsole(
      `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp plugin uninstall ${plugin}`
    );
    console.log('SALIDA DESINSTALANDO EL PLUGIN', plugin);
    console.log(installingPlugin);
  }
  catch (error) {
    console.error('Falló desinstalando el plugin', error);
    throw new Error('Falló desinstalando el plugin');
  }
}

const deactivatePlugin = async (plugin,pathNewProject,cliServiceName) => {
  try { 
    const installingPlugin = await executeInConsole(
      `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp plugin deactivate ${plugin}`
    );
    console.log('SALIDA DESACTIVANDO EL PLUGIN', plugin);
    console.log(installingPlugin);
  }
  catch (error) {
    console.error('Falló desactivando el plugin', error);
    throw new Error('Falló desactivando el plugin');
  }
}

const deletePlugin = async (plugin,pathNewProject,cliServiceName) => {
  try { 
    const installingPlugin = await executeInConsole(
      `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp plugin delete ${plugin}`
    );
    console.log('SALIDA ELIMINANDO EL PLUGIN', plugin);
    console.log(installingPlugin);
  }
  catch (error) {
    console.error('Falló eliminando el plugin', error);
    throw new Error('Falló eliminando el plugin');
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

const deleteInaciveThemes = async (pathNewProject,cliServiceName) => {
  try { 
    const inaciveThemesList = await executeInConsole(`cd ${pathNewProject} && docker-compose run ${cliServiceName} wp theme list --status=inactive --field=name`);
    const themes = inaciveThemesList.trim().split('\n');
    let result = '';

    for (let theme of themes) {
      result += await executeInConsole(
        `cd ${pathNewProject} && docker-compose run ${cliServiceName} wp theme delete ${theme}`
      );
    }
    
    
    console.log('SALIDA ELIMINANDO TEMAS INACTIVOS', result);
    console.log(result);
  }
  catch (error) {
    console.error('Falló eliminando temas inactivos', error);
    throw new Error('Falló eliminando temas inactivos');
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
  
  const cliServiceName = `${projectSnakeCase}_wpcli_${currentTime}`;
  const cliContainerName = `${projectSnakeCase}_wpcli_cont_${currentTime}`;

  const dbName = `${projectSnakeCase}_${currentTime}`;
  const dbUser = `${projectSnakeCase}_${currentTime}`;

  const networkName = `${projectSnakeCase}_network_${currentTime}`;

  const repoUrl = await doQuestion('Url del repositorio:', true, 'a');
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
        CLI_SERVICE_NAME: cliServiceName,
        CLI_CONTAINER_NAME: cliContainerName,
        WEB_PORT: webPort,
        THEME_NAME: folderName,
        PROJECT_NAME_FOR_CSS_CLASS: folderName,
        PROJECT_NAME: projectName,
        REPO_URL: repoUrl,
        WORDPRESS_VERSION: wordpressVersion,
        SUFFIX_NAMES: currentTime,
        ADMIN_PASSWORD: adminPassword,
        WEB_TITLE: webTitle
      },
      pathNewProject
    );
    copyPreinstalledPlugins(pathNewProjectRoot);
  }

  console.log('Levantando containers de Docker...')
  const runDocker = await executeInConsole(
    `cd ${pathNewProject} && docker-compose up --build -d`
  );
  console.log('run docker is', runDocker);

  let control = true;
  console.log('Comprobando instalación de wordpress...');
  while (control) {
    const wordpressInstalled = await wpIsInstalled(webPort,folderName);
    if (wordpressInstalled) {
      control = false;
      continue;
    }

    console.log('Wordpress no instalado...',new Date().getTime());
    await delay(2)
  }
  
  console.log('WORDPRESS INSTALADO CON ÉXITO');
  console.log()
  console.log('ACTIVANDO TEMA')
  await activateTheme(cliServiceName, folderName, pathNewProject);

  console.log()
  console.log('INSTALANDO PLUGINS')
  //install duplicator
  await installPlugin('duplicator', pathNewProject, cliServiceName);

  // await installPlugin(`/var/www/html/wp-content/themes/${folderName}/plugins-pro/advanced-custom-fields-pro.zip`, pathNewProject, cliServiceName);

  console.log()
  console.log('ACTIVANDO PLUGINS')
  await activatePlugin('duplicator advanced-custom-fields-pro', pathNewProject, cliServiceName);

  console.log()
  console.log('DESACTIVANDO PLUGINS')
  await deactivatePlugin('akismet hello', pathNewProject, cliServiceName);

  console.log()
  console.log('DESINSTALANDO PLUGINS')
  await uninstallPlugin('akismet hello', pathNewProject, cliServiceName);

  console.log()
  console.log('ELIMINANDO THEMES INACTIVOS')
  await deleteInaciveThemes(pathNewProject, cliServiceName);

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
