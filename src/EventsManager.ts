import Database from 'better-sqlite3';

export class EventsManager {

    private database;

    constructor() {
        this.database = new Database('../events.db', { verbose: console.log });
    }

    public async sync(events: CalendarEvent[]) {
        if (this.noChangesDetected(events)) return;

        // const storedEvents = this.getNewEvents(events);

        // console.log(storedEvents);
    }

    private noChangesDetected(_events: Object[]): boolean {
        return false;
    }

    private getNewEvents(_events: CalendarEvent[]): CalendarEvent[] | null {
        const storedEventsForFile = this.database.prepare('SELECT * FROM events WHERE path')

        console.log(storedEventsForFile);

        return [<CalendarEvent>{}]
    }
}
