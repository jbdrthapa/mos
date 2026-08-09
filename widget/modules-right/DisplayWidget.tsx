import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "gnim";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";
import DisplayService from "../../services/DisplayService";

export function DisplayWidget(controller: AccordionController) {

    let displayService = DisplayService.get_default();

    // Reactive binding to the display-mode property
    const selectedMode = createBinding(displayService, "display-mode") as Accessor<string>;

    const modes = [
        "SDR",
        "HDR Min",
        "HDR Low",
        "HDR",
        "HDR Max",
    ];

    const model = Gtk.StringList.new(modes);

    const dropdown = new Gtk.DropDown({
        model,
        enable_search: false,
        css_name: "display-mode-selector",
        vexpand: false,
        hexpand: false,
        halign: Gtk.Align.CENTER,
        widthRequest: 150
    });

    dropdown.connect("map", () => {
        const value = selectedMode.get();
        const index = modes.indexOf(value);
        if (index >= 0) dropdown.set_selected(index);
    });

    dropdown.connect("notify::selected", () => {
        const index = dropdown.get_selected();
        const value = modes[index];
        // console.log("Selected : " + index + " value : " + value);
    });

    selectedMode.subscribe((value) => {
        const index = modes.indexOf(value);
        if (index >= 0) dropdown.set_selected(index);
    });

    const applyButton = (
        <button cssName="pill-content-button" label="Apply" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    applyButton.connect("clicked", () => {
        const index = dropdown.get_selected();
        const value = modes[index];
        displayService.apply_display_mode(value);
    });


    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={12} cssName="pill-content">
            <label label="Display Mode" cssName={"pill-content-header"} />
            {dropdown}
            {applyButton}
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "display",
        controller: controller,
        iconName: "󰍹",
        title: "Display",
        detail: createBinding(displayService, "display-mode"),
        content,
    });
}
