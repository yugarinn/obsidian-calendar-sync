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

        const events = await this.getFileEvents(file)

        if (events.length) {
            new EventsManager().sync(events);
        }
    }

    private currentFolderIsBeingWatched(file: TFile, watchedFolders: string[]): boolean {
        if (watchedFolders.contains(file.parent.path)) return true;
        return false;
    }

    private async getFileEvents(file: TFile): Promise<CalendarEvent[]> {
        const lines = (await this.app.vault.read(file)).split('\n');

        return lines.map((line) => {
            const match = line.match(this.timeFormatRegex)
            if (match) return this.parseEvent(match);
        }).filter((event): event is CalendarEvent => !!event);
    }

    private parseEvent(event: RegExpMatchArray): CalendarEvent {
        return <CalendarEvent> {
            path: event.input,
            line: 1,
            text: 'text',
            startsAt: 'now',
            endsAt: 'later'
        };
    }
}
