const { executeInConsole } = require("../utils/execute-in-console");
const { wpIsInstalled } = require("../utils/wp-is-installed");
const { CliStrategy } = require("./CliStrategy");

class StrategyWithDocker extends CliStrategy{
    constructor({ pathNewProject,cliServiceName,folderName,webPort }){
        super()
        this.config = { pathNewProject,cliServiceName,folderName,webPort };
    }

    async installWordpress(){
        console.log('Levantando containers de Docker...')
        const runDocker = await executeInConsole(
            `cd ${this.config.pathNewProject} && docker-compose up --build -d`
        );
        console.log('run docker is', runDocker);

        let control = true;
        console.log('Comprobando instalación de wordpress...');

        while (control) {
            const wordpressInstalled = await wpIsInstalled(this.config.webPort,this.config.folderName);
            if (wordpressInstalled) {
                control = false;
                continue;
            }
        
            console.log('Wordpress no instalado...',new Date().getTime());
            await delay(2)
        }

        return true;
    }

    async changeLanguage( newLanguage ){
        try {
            const installingTheme = await executeInConsole(
              `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp language core install ${newLanguage}`
            )
            const activatingTheme = await executeInConsole(
              `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp site switch-language ${newLanguage}`
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
                `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp theme activate ${this.config.folderName}`
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
              `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp plugin install ${pluginName}`
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
              `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp plugin activate ${pluginsName}`
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
              `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp plugin deactivate ${pluginsName}`
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
              `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp plugin uninstall ${pluginsName}`
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
            const inaciveThemesList = await executeInConsole(`cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp theme list --status=inactive --field=name`);
            const themes = inaciveThemesList.trim().split('\n');
            let result = '';
        
            for (let theme of themes) {
              result += await executeInConsole(
                `cd ${this.config.pathNewProject} && docker-compose run ${this.config.cliServiceName} wp theme delete ${theme}`
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

module.exports.StrategyWithDocker = StrategyWithDocker;