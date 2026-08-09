import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";

const accordion = new AccordionController();

export function WirelessNetworkWidget(controller: AccordionController) {
    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <label label="Wireless Network" />
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "wireless-network",
        controller: controller,
        iconName: "",
        title: "Wireless",
        detail: "Connected",
        content,
    });
}
