import Gtk from "gi://Gtk?version=4.0";
import { DisplayWidget } from "./DisplayWidget";
import { BluetoothWidget } from "./BluetoothWidget";
import { WiredNetworkWidget } from "./WiredNetworkWidget";
import { WirelessNetworkWidget } from "./WirelessNetworkWidget";
import { AccordionController } from "./AccordionController";

const accordion = new AccordionController();

export function PillWidgets() {

    const displayWidget = DisplayWidget(accordion);
    const bluetoothWidget = BluetoothWidget(accordion);
    const wiredNetworkWidget = WiredNetworkWidget(accordion);
    const wirelessNetworkWidget = WirelessNetworkWidget(accordion);

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <box orientation={Gtk.Orientation.HORIZONTAL}>
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        {displayWidget}
                    </box>

                    <box orientation={Gtk.Orientation.VERTICAL}>
                        {bluetoothWidget}
                    </box>
                </box>
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <box orientation={Gtk.Orientation.HORIZONTAL}>
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        {wiredNetworkWidget}
                    </box>

                    <box orientation={Gtk.Orientation.VERTICAL}>
                        {wirelessNetworkWidget}
                    </box>
                </box>

            </box>
        </box>
    );
}