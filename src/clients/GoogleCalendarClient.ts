import * as GoogleCalendar from '@googleapis/calendar';
import credentials from '../../google_credentials.json'

export class GoogleCalendarClient {
    SCOPE = 'https://www.googleapis.com/auth/calendar';

    public async listEventsFor(date: string) {
        const client = this.getCalendarClient();

        const timeMin = `${date}T00:00:00+02:00`;
        const timeMax = `${date}T23:59:59+02:00`;

        const response = await client.events.list({ calendarId: 'sergiouve@gmail.com', timeMin, timeMax });
        const events = response.data.items;

        return events;
    }

    private getCalendarClient() {
        const auth = new GoogleCalendar.auth.JWT(credentials.client_email, '', credentials.private_key, this.SCOPE);

        return GoogleCalendar.calendar({
            version: 'v3',
            auth: auth
        });
    }
}
