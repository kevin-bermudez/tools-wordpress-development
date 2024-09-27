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
        const command = process.env.IN_MAC ? `${this.config.dbBin} -u root -e "CREATE DATABASE ${this.config.dbName}"` : `cd ${this.config.dbBin} && mysql.exe -u root -e "CREATE DATABASE ${this.config.dbName}"`; 
        const creatingDb = await executeInConsole(command);
        console.log('Base de datos creada resultado:', creatingDb);

        console.log('Descargando Wordpress...')
        const downloadWordpress = await executeInConsole(
            `cd ${this.config.pathNewProject} && wp core download`
        );
        console.log('Descarga de wordpress is', downloadWordpress);

        console.log('Creando wp-config');
        const creatingWpConfig = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp config create --dbhost=localhost:3306 --dbname="${this.config.dbName}" --dbuser="root" --dbpass=""`
        );
        console.log('wp-config creado', creatingWpConfig);

        console.log('Instalando Wordpress');
        const installWordpress = await executeInConsole(
            `cd ${this.config.pathNewProject} &&  wp core install --url=http://localhost/${this.config.folderName} --title="${this.config.webTitle}" --admin_user=dev --admin_email=kevinbermudezmejia@gmail.com --admin_password="${this.config.adminPassword}"`
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

    async configPagesBlog(){
      try { 
        const creatingBlogPage = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post create --post_type=page --post_title="Blog" --post_status=publish`
        );
        console.log('SALIDA CREANDO PÁGINA DE BLOG');
        console.log(creatingBlogPage);

        const blogPageId = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post list --title="Blog" --post_type=page --field=ID`
        );

        const showOnFront = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp option update show_on_front page`
        );
        console.log('Página de blog seteada como página estátita',showOnFront);

        const settingBlogPage = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp option update page_for_posts ${blogPageId}`
        ); 
        console.log('SALIDA SETEANDO PÁGINA DE BLOG');
        console.log(settingBlogPage);

        const creatingHomePage = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post create --post_type=page --post_title="Home" --post_status=publish`
        );
        console.log('SALIDA CREANDO PÁGINA DE INICIO');
        console.log(creatingHomePage);

        const homePageId = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post list --title="Home" --post_type=page --field=ID`
        );

        const settingHomePage = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp option update page_on_front ${homePageId}`
        ); 
        console.log('SALIDA SETEANDO PÁGINA DE INICIO');
        console.log(settingHomePage);
      }
      catch (error) {
        console.error('Falló seteando página de inicio y de blog', error);
        throw new Error('Falló seteando página de inicio y de blog');
      }
    }

    async deleteExamplePosts(){
      try { 
        const samplePageId = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post list --title="Sample page" --post_type=page --field=ID`
        );
        console.log('SALIDA OBTENIENDO SAMPLE PAGE');
        console.log(samplePageId);

        const deletingSamplePage = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post delete ${samplePageId}`
        );
        console.log('SALIDA BORRANDO SAMPLE PAGE');
        console.log(deletingSamplePage);

        const postId = await executeInConsole(`cd ${this.config.pathNewProject} && wp post list --title="Hello world!" --post_type=post --field=ID`);
        console.log('SALIDA OBTENIENDO HELLO WORLD POST');
        console.log(postId);

        const deletingSamplePost = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp post delete ${postId}`
        );
        console.log('SALIDA BORRANDO SAMPLE PAGE');
        console.log(deletingSamplePost);
      }
      catch(error){
        console.error('Falló borrando posts de prueba', error);
        throw new Error('Falló borrando posts de prueba');
      }
    }

    async setGeneralConfigs(){
      try { 
        const enlacesPermanentes = await executeInConsole(
          `cd ${this.config.pathNewProject} && wp option update permalink_structure "/%postname%/"`
        );
        console.log('Enlaces permanentes seteados',enlacesPermanentes);
      }
      catch(error){
        console.error('Falló seteando enlaces permanentes', error);
        throw new Error('Falló seteando enlaces permanentes');
      }
    }
}

module.exports.StrategyWithXampp = StrategyWithXampp;