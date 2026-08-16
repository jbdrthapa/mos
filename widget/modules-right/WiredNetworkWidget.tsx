import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";
import { createBinding, createComputed } from "gnim";
import Network from "gi://AstalNetwork";

export function WiredNetworkWidget(controller: AccordionController) {


    const NM_STATE: Record<number, string> = {
        0: "Unknown",
        10: "Unmanaged",
        20: "Unavailable",
        30: "Disconnected",
        40: "Prepare",
        50: "Config",
        60: "Need Auth",
        70: "IP Config",
        80: "IP Check",
        90: "Secondaries",
        100: "Activated",
        110: "Deactivating",
        120: "Failed"
    };

    const NM_SPEED: Record<number, string> = {
        // Unknown / link down
        0: "Unknown",
        10: "10 Mbps",
        100: "100 Mbps",
        1000: "1 Gbps",
        // Multi‑Gig speeds (AstalNetwork / NMDeviceEthernet raw values)
        2500: "2.5 Gbps",
        5000: "5 Gbps",
        // High‑speed NICs
        10000: "10 Gbps",
        25000: "25 Gbps",
        100000: "100 Gbps"
    };

    let detail = "";

    const network = Network.get_default();

    const wired = network.wired;

    if (!wired) {
        detail = "Unavailable"
        return;
    }

    const device = createBinding(wired, "device");

    const iconName = createBinding(wired, "iconName");

    const deviceInterface = createComputed(() => {
        return device().interface;
    });

    const macAddress = createComputed(() => {
        return device().hwAddress;
    });

    const mtu = createComputed(() => {
        return device().mtu.toString();
    });

    const rawState = createBinding(wired, "state");
    const state = createComputed(() => {
        return NM_STATE[rawState()] ?? "?";
    });

    const rawSpeed = createBinding(wired, "speed");
    const speed = createComputed(() => {
        return NM_SPEED[rawSpeed()] ?? "?";
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content" spacing={10}>
            <label label="W I R E D" cssName={"pill-content-header"} />
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20} marginStart={15} marginTop={10} marginBottom={10}>
                <image iconSize={Gtk.IconSize.NORMAL} iconName={iconName} />
                <label label={deviceInterface} halign={Gtk.Align.START} />
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label="MAC" xalign={0} cssName="pill-param-caption" halign={Gtk.Align.START} />
                <label label={macAddress} cssName="pill-param-value" halign={Gtk.Align.START} />
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label="State" xalign={0} cssName="pill-param-caption" halign={Gtk.Align.START} />
                <label label={state} cssName="pill-param-value" halign={Gtk.Align.START} />
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label="Speed" xalign={0} cssName="pill-param-caption" halign={Gtk.Align.START} />
                <label label={speed} cssName="pill-param-value" halign={Gtk.Align.START} />
            </box>
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "wired-network",
        controller: controller,
        iconName: "󰈀",
        title: "Wired",
        detail: deviceInterface,
        content,
    });
}
