// ConfigManager.js

class ConfigManager {
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }

        this.setting1 = localStorage.getItem('setting1') || '';
        this.setting2 = localStorage.getItem('setting2') === 'true';

        ConfigManager.instance = this;
    }

    getSettings() {
        return {
            setting1: this.setting1,
            setting2: this.setting2,
        };
    }

    setSettings(newSetting1, newSetting2) {
        this.setting1 = newSetting1;
        this.setting2 = newSetting2;

        localStorage.setItem('setting1', newSetting1);
        localStorage.setItem('setting2', newSetting2);
    }
}

const instance = new ConfigManager();
// Object.freeze(instance); // Remove this line to allow property modifications

export default instance;
