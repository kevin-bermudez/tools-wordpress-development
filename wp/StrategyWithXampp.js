const { executeInConsole } = require("../utils/execute-in-console");
const { wpIsInstalled } = require("../utils/wp-is-installed");
const { CliStrategy } = require("./CliStrategy");

class StrategyWithXampp extends CliStrategy{
    constructor({ pathNewProject,folderName,webPort = 80,webTitle,adminPassword,dbBin,dbName }){
        super()
        this.config = { pathNewProject,folderName,webPort,webTitle,adminPassword,dbBin,dbName };
    }

    async installWordpress(){
        console.log('Creando base de datos')
        const creatingDb = await executeInConsole(`cd ${this.config.dbBin} && mysql.exe -u root -e "CREATE DATABASE ${this.config.dbName}"`)
        console.log('Base de datos creada resultado:', creatingDb);

        console.log('Descargando Wordpress...')
        const downloadWordpress = await executeInConsole(
            `cd ${this.config.pathNewProject} && wp core download`
        );
        console.log('Descarga de wordpress is', downloadWordpress);

        console.log('Creando wp-config');
        const creatingWpConfig = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp config create --dbname="${this.config.dbName}" --dbuser="root" --dbpass=""`
        );
        console.log('Descarga de wordpress is', creatingWpConfig);

        console.log('Instalando Wordpress');
        const installWordpress = await executeInConsole(
            `cd ${this.config.pathNewProject} &&  wp core install --url=http://localhost/${this.config.folderName} --title="${this.config.webTitle}" --admin_user=dev --admin_email=kevinbermudezmejia@gmail.com --admin_password="${this.config.adminPassword}`
        );
        console.log('Instalación de wordpress is', installWordpress);

        return true;
    }

    async changeLanguage( newLanguage ){
        try {
            const installingTheme = await executeInConsole(
              `cd ${this.config.pathNewProject} && wp language core install ${newLanguage}`
            )
            const activatingTheme = await executeInConsole(
              `cd ${this.config.pathNewProject} && wp site switch-language ${newLanguage}`
            );
        
            console.log();
            console.log('SALIDA INSTALANDO EL IDIOMA', newLanguage);
            console.log(installingTheme);
        
            console.log('SALIDA CAMBIANDO EL IDIOMA', newLanguage);
            console.log(activatingTheme);
        }
        catch (error) {
            console.error('Falló cambiando el idioma', error);
            throw new Error('Falló cambiando el idioma');   
        }
    }

    async activateTheme(){
        try { 
            const activatingTheme = await executeInConsole(
                `cd ${this.config.pathNewProject} && wp theme activate ${this.config.folderName}`
            );
            console.log('SALIDA ACTIVANDO EL TEMA', this.config.folderName);
            console.log(activatingTheme);
        }
        catch (error) {
            console.error('Falló activando el tema', error);
            throw new Error('Falló activando el tema');
        }
    }

    async installPlugin( pluginName ){
        try { 
            const installingPlugin = await executeInConsole(
              `cd ${this.config.pathNewProject} && wp plugin install ${pluginName}`
            );
            console.log('SALIDA INSTALANDO EL PLUGIN', pluginName);
            console.log(installingPlugin);
        }
            catch (error) {
            console.error('Falló instalando el plugin', error);
            throw new Error('Falló instalando el plugin');
        }
    }

    async activatePlugin( pluginsName ){
        try { 
            const installingPlugin = await executeInConsole(
              `cd ${this.config.pathNewProject} && wp plugin activate ${pluginsName}`
            );
            console.log('SALIDA ACTIVANDO EL PLUGIN', pluginsName);
            console.log(installingPlugin);
          }
          catch (error) {
            console.error('Falló activando el plugin', error);
            throw new Error('Falló activando el plugin');
          }
    }

    async deactivatePlugin( pluginsName ){
        try { 
            const installingPlugin = await executeInConsole(
              `cd ${this.config.pathNewProject} && wp plugin deactivate ${pluginsName}`
            );
            console.log('SALIDA DESACTIVANDO EL PLUGIN', pluginsName);
            console.log(installingPlugin);
          }
          catch (error) {
            console.error('Falló desactivando el plugin', error);
            throw new Error('Falló desactivando el plugin');
          }
    }

    async uninstallPlugin( pluginsName ){
        try { 
            const installingPlugin = await executeInConsole(
              `cd ${this.config.pathNewProject} && wp plugin uninstall ${pluginsName}`
            );
            console.log('SALIDA DESINSTALANDO EL PLUGIN', pluginsName);
            console.log(installingPlugin);
          }
          catch (error) {
            console.error('Falló desinstalando el plugin', error);
            throw new Error('Falló desinstalando el plugin');
          }
    }

    async deleteInaciveThemes(){
        try { 
            const inaciveThemesList = await executeInConsole(`cd ${this.config.pathNewProject} && wp theme list --status=inactive --field=name`);
            const themes = inaciveThemesList.trim().split('\n');
            let result = '';
        
            for (let theme of themes) {
              result += await executeInConsole(
                `cd ${this.config.pathNewProject} && wp theme delete ${theme}`
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
}

module.exports.StrategyWithXampp = StrategyWithXampp;