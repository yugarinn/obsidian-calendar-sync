import { Vault, TFile } from 'obsidian';
import { GoogleCalendarClient } from './clients/GoogleCalendarClient';

export class EventsManager {

    readonly eventsFilePath: string = '/.obsidian/plugins/obsidian-calendar-sync/database/events.json';

    private vault: Vault;

    constructor(vault: Vault) {
        this.vault = vault;
    }

    public async sync(fileEvents: CalendarEvent[], date: string) {
        if (this.noChangesDetected()) return;

        const localEvents = await this.loadLocalEventsFor(date);
        const externalEvents = await (new GoogleCalendarClient()).listEventsFor(date);

        fileEvents.forEach((fileEvent) => {
            if (!this.fileEventIsCached(localEvents, fileEvent)) {
            }
        });
    }

    private async loadLocalEventsFor(date: string) {
        const exists = await this.vault.adapter.exists(this.eventsFilePath);

        if (!exists) await this.createEmptyEventsFile();

        const localFileContents = JSON.parse(await this.vault.adapter.read(this.eventsFilePath));
        const events = localFileContents[date];

        return events.map((event: any) => event as CalendarEvent)
    }

    private fileEventIsCached(localEvents: CalendarEvent[], fileEvent: CalendarEvent): boolean {
        return Boolean(localEvents.filter((event) => {
            return event.startsAt == fileEvent.startsAt && event.endsAt == fileEvent.endsAt;
        }).length);
    }

    private noChangesDetected(): boolean {
        return false;
    }

    private async createEmptyEventsFile(): Promise<TFile> {
        return await this.vault.create(this.eventsFilePath, '{}');
    }
}
