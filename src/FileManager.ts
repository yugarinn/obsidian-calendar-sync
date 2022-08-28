import { App, TFile } from 'obsidian';
import { EventsManager } from './EventsManager';

export class FileManager {

    readonly timeFormatRegex = /<([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]>$/;

    private app: App;

    private watchedFolders: string[];

    constructor(app: App, watchedFolders: string[]) {
        this.app = app;
        this.watchedFolders = watchedFolders;
    }

    public async check(file: TFile): Promise<void> {
        if (!this.currentFolderIsBeingWatched(file, this.watchedFolders)) return;

        const date = this.getFileDate(file);
        const events = await this.getFileEvents(file, date);

        if (events.length) {
            new EventsManager(this.app.vault).sync(events, date);
        }
    }

    private currentFolderIsBeingWatched(file: TFile, watchedFolders: string[]): boolean {
        if (watchedFolders.contains(file.parent.path)) return true;

        return false;
    }

    private getFileDate(file: TFile) {
        return file.name.split('.')[0];
    }

    private async getFileEvents(file: TFile, fileDate: string): Promise<CalendarEvent[]> {
        const lines = (await this.app.vault.read(file)).split('\n');

        return lines.map((line) => {
            const match = line.match(this.timeFormatRegex)
            if (match) return this.parseEvent(file, match, fileDate);
        }).filter((event): event is CalendarEvent => !!event);
    }

    private parseEvent(file: TFile, event: RegExpMatchArray, fileDate: string): CalendarEvent {
        const dates = this.parseDatetimesFromTag(event[0], fileDate);

        return <CalendarEvent> {
            localFilePath: file.path,
            text: this.parseTextFromEvent(event),
            startsAt: dates[0],
            endsAt: dates[1]
        };
    }

    private parseDatetimesFromTag(tag: string, fileDate: string): Date[] {
        const sanitizedDates = tag.replace(/<|>/g, '').split('-');

        const startDate = `${fileDate} ${sanitizedDates[0]}`;
        const endDate = `${fileDate} ${sanitizedDates[1]}`;

        return [new Date(startDate), new Date(endDate)]
    }

    private parseTextFromEvent(event: RegExpMatchArray): string {
        const inputText = event.input || '';

        return inputText.split('- [ ]')[1].split('<')[0].trim();
    }
}
