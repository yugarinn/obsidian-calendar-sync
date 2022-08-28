export class GoogleCalendarEvent {
   public async createEvents(events: CalendarEvent[]) {
       this.send(events);
   }

   private send(events: CalendarEvent[]) {
       console.log('sending...', events)
   }
}
