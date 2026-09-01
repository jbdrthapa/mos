import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "gnim";
import DisplayService from "../../services/DisplayService";

export function DisplayControlsWidget() {

    const displayService = DisplayService.get_default();
    const descriptionTooltip = createBinding(displayService, "display_device").as(d => d ?? "");
    const description = createBinding(displayService, "display_device").as(d => {
        const s = d ?? "";
        return s.length > 40 ? s.slice(0, 37) + "…" : s;
    });

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} cssName="display-controls-container" marginTop={30}>
            <label label={createBinding(displayService, "brightness_icon")} cssName={"brightness-icon"} />
            <label valign={Gtk.Align.CENTER} label={createBinding(displayService, "brightness_percent").as((value) => String(value))} cssName={"brightness-percent"} />
            <box orientation={Gtk.Orientation.VERTICAL}>
                <label xalign={0} label={description} tooltipText={descriptionTooltip} cssName="slider-device-name" />
                <slider
                    cssClasses={["slider-control"]}
                    tooltipText={createBinding(displayService, "brightness_percent").as((value) => String(value))}
                    widthRequest={320}
                    min={0}
                    max={100}
                    value={createBinding(displayService, "brightness_percent")}
                    onValueChanged={({ value }) => {
                        displayService.setBrightnessValue(value);
                    }}
                />
            </box>
        </box>
    );
}