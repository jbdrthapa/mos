import Gtk from "gi://Gtk?version=4.0";

export function CalendarWidget() {
    return new Gtk.Calendar({
        css_name: "detail-calendar",
    });
}
