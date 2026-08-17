import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { Astal } from "ags/gtk4";
import AstalNiri from "gi://AstalNiri";
import GObject from "gnim/gobject";
import app from "ags/gtk4/app"

export default GObject.registerClass({
    GTypeName: "PopupWindow",
}, class PopupWindow extends Astal.Window {
    // Keep a reference to the revealer to toggle it
    private revealer: Gtk.Revealer;

    constructor(props: any & { child: Gtk.Widget }) {
        const { name, child, ...rest } = props;

        super({
            ...rest,
            name,
            layer: Astal.Layer.OVERLAY,
            visible: false,
            keymode: Astal.Keymode.ON_DEMAND,
            cssName: "popup-window-style",
            vexpand: false,
            valign: Gtk.Align.START
        });

        const revealer = new Gtk.Revealer({
            child: child,
            transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN,
            transition_duration: 300,
            reveal_child: false,
        });

        this.revealer = revealer;
        this.set_child(revealer);

        const controller = new Gtk.EventControllerKey();
        controller.connect("key-pressed", (_, keyval) => {
            if (keyval === Gdk.KEY_Escape) {
                this.hide_all();
                return true;
            }
            return false;
        });
        this.add_controller(controller);

        // Niri focus behavior
        const niri = AstalNiri.get_default();
        niri.connect("notify::focused-window", (service) => {
            if (service.focused_window?.title) {
                this.hide_all();
            }
        });

        niri.connect("overview-opened-or-closed", () => {
            this.hide_all();
        });
    }

    hide_others() {
        app.get_windows().forEach(window => {
            if (window !== this && window.name !== "bar-background") {
                window.hide()
            }
        });
    }

    hide_all() {
        this.revealer.reveal_child = false;

        setTimeout(() => {
            if (!this.revealer.reveal_child) {
                this.set_visible(false);
            }
        }, 50);
    }

    toggle() {
        if (this.get_visible() && this.revealer.reveal_child) {
            this.hide_all();
        } else {
            this.set_visible(true);
            this.hide_others();
            setTimeout(() => {
                this.revealer.reveal_child = true;
            }, 10);
        }
    }
});
