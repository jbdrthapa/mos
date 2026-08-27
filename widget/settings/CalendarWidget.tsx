import Gtk from "gi://Gtk?version=4.0"

export function CalendarWidget() {

    // Declare the calendar control to be used
    const calendar = new Gtk.Calendar({
        css_name: "detail-calendar",
    });

    return calendar;
}