import AstalWp from "gi://AstalWp?version=0.1";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "gnim";
import { SliderAccordionController } from "./SliderAccordionController";

export function AudioSliderWidget({
    id,
    controller,
    endPoint,
    content
}: {
    id: string;
    controller: SliderAccordionController;
    endPoint: AstalWp.Endpoint;
    content: Gtk.Widget;
}) {

    function SliderSet({ endpoint }: { endpoint: AstalWp.Endpoint }) {
        const descriptionTooltip = createBinding(endpoint, "description").as(d => d ?? "");
        const description = createBinding(endpoint, "description").as(d => {
            const s = d ?? "";
            return s.length > 35 ? s.slice(0, 32) + "…" : s;
        });
        const volumeIcon = createBinding(endpoint, "volumeIcon");
        const volume = createBinding(endpoint, "volume");
        const volumeText = volume.as((value) => String(Math.trunc(value * 100)));

        return (
            <box orientation={Gtk.Orientation.HORIZONTAL} heightRequest={80}>
                <image
                    pixelSize={28}
                    iconName={volumeIcon} cssName={"audio-icon"} />
                <label valign={Gtk.Align.CENTER} label={volumeText} cssName={"audio-percent"} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label xalign={0} label={description} tooltipText={descriptionTooltip} cssName="slider-device-name" />
                    <slider
                        cssClasses={["slider-control"]}
                        tooltipText={volumeText}
                        widthRequest={320}
                        onChangeValue={({ value }) => endpoint.set_volume(value)}
                        value={createBinding(endpoint, "volume")} />
                </box>
            </box>
        );
    }

    const revealer = new Gtk.Revealer({
        reveal_child: false,
        transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN,
        transitionDuration: 400
    });

    // Register with controller
    controller.register(id, (openedId) => {
        if (openedId !== id) {
            revealer.set_reveal_child(false);
        }
    });

    const button = (
        <button vexpand={true} valign={Gtk.Align.CENTER} cssName="audio-slider-button">
            <label label="" cssName="slider-content-extender" />
        </button>
    ) as Gtk.Button;


    const sliderWidget = (
        <box>
            <SliderSet endpoint={endPoint} />
            {button}
        </box>
    );

    button.connect("clicked", () => {
        const newState = !revealer.get_reveal_child();
        revealer.set_reveal_child(newState);

        if (newState) {
            controller.open(id);
        }
    });

    revealer.set_child(content);

    return (

        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-container">
            {sliderWidget}
            {revealer}
        </box>
    );
}
