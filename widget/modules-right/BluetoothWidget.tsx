import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";

const accordion = new AccordionController();

export function BluetoothWidget(controller: AccordionController) {
    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <label label="Bluetooth" />
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "bluetooth",
        controller: controller,
        iconName: "󰂯",
        title: "Bluetooth",
        detail: "Connected",
        content,
    });
}
