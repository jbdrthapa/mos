import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "gnim";
import { AccordionController } from "./AccordionController";

export function PillWidget({
    id,
    controller,
    iconName,
    title,
    detail,
    content,
}: {
    id: string;
    controller: AccordionController;
    iconName: string;
    title: string;
    detail?: string | ReturnType<typeof createBinding>;
    content: Gtk.Widget;
}) {

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
        <button cssName="pill-button">
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
                <label label={iconName} cssName="pill-button-image" />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label xalign={0} label={title} cssName="pill-button-name" />
                    {detail && (
                        <label xalign={0} label={detail} cssName="pill-button-detail" />
                    )}
                </box>
            </box>
        </button>
    ) as Gtk.Button;

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
            {button}
            {revealer}
        </box>
    );
}
