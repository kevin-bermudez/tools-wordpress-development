class CliStrategy {
    setStrategy(strategy){
        this.strategy = strategy;
    }

    async installWordpress( config ){
        return await this.strategy.installWordpress( config );
    }

    async changeLanguage( newLanguage ){
        return await this.strategy.changeLanguage( newLanguage )
    }

    async activateTheme(){
        return await this.strategy.activateTheme()
    }

    async installPlugin( pluginName ){
        return await this.strategy.installPlugin( pluginName )
    }

    async activatePlugin( pluginsName ){
        return await this.strategy.activatePlugin( pluginsName )
    }

    async deactivatePlugin( pluginsName ){
        return await this.strategy.deactivatePlugin( pluginsName )
    }

    async uninstallPlugin( pluginsName ){
        return await this.strategy.uninstallPlugin( pluginsName )
    }

    async deleteInaciveThemes(){
        return await this.strategy.deleteInaciveThemes()
    }
}

module.exports.CliStrategy = CliStrategy;