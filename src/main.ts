import { App, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { FileManager } from './FileManager';

interface CalendarSyncSettings {
    lookupFoldersList: string[];
}

const DEFAULT_SETTINGS: CalendarSyncSettings = {
    lookupFoldersList: []
}

export default class CalendarSync extends Plugin {
    settings: CalendarSyncSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new CalendarSyncSettingsTab(this.app, this));

        const fileManager = new FileManager(this.app, this.settings.lookupFoldersList);

        this.registerEvent(this.app.vault.on('modify', async (_event) => {
            const currentFile = this.app.workspace.getActiveFile();

            if (currentFile instanceof TFile) fileManager.check(currentFile)
        }));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class CalendarSyncSettingsTab extends PluginSettingTab {
    plugin: CalendarSync;

    constructor(app: App, plugin: CalendarSync) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'CalendarSync Settings'});

        new Setting(containerEl)
            .setName('Lookup folders')
            .setDesc('Comma separated list of folders where the plugin will look for events')
            .addText(text => text
                .setPlaceholder('Ex: "/journal, /projects/deadlines"')
                .setValue(this.plugin.settings.lookupFoldersList.join(', '))
                .onChange(async (value) => {
                    this.plugin.settings.lookupFoldersList = value.split(',').map((folderName) => folderName.trim());
                    await this.plugin.saveSettings();
                }));
    }
}
