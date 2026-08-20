import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import Network from "gi://AstalNetwork"
import { For, createBinding, createComputed } from "gnim";
import { PillWidget } from "./PillWidget";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export function WirelessNetworkWidget(controller: AccordionController) {

    let selectedDevice: Network.AccessPoint;

    const hscroll_policy = Gtk.PolicyType.NEVER;
    const vscroll_policy = Gtk.PolicyType.AUTOMATIC;
    const min_height = 200;
    const apLabelWidth = 18;

    const network = Network.get_default();

    const wifi = network.wifi;

    if (!wifi) {
        return;
    }

    const device = createBinding(wifi, "device");

    const access_points = createBinding(wifi, "accessPoints");

    const filtered_accessPoints = createComputed(() => {
        const allAPs = access_points() || [];

        return allAPs
            .sort((a, b) => {
                const hasSsidA = !!a.ssid && a.ssid.trim().length > 0;
                const hasSsidB = !!b.ssid && b.ssid.trim().length > 0;

                // Devices with SSID go first
                if (hasSsidA && !hasSsidB) return -1;
                if (!hasSsidA && hasSsidB) return 1;

                // If both have ssid or both don't, sort alphabetically by alias/name
                const labelA = a.ssid || a.ssid || "";
                const labelB = b.ssid || b.ssid || "";

                return labelA.localeCompare(labelB);
            });
    });

    const iface = createComputed(() => {
        return device().interface;
    });

    const mac = createComputed(() => {
        return device().hwAddress;
    });

    const accessPointsListBox = (
        <Gtk.ListBox
            cssName="devices-box"
            onRowSelected={(self, row) => {
                if (row) {
                    const index = row.get_index();
                    selectedDevice = filtered_accessPoints()[index];
                    console.log("Selected:", selectedDevice.ssid);
                }
            }}
        >
            <For each={filtered_accessPoints}>
                {(ap) => {
                    const ssid = createBinding(ap, "ssid");
                    const bssid = createBinding(ap, "bssid");
                    const mode = createBinding(ap, "mode");
                    const strength = createBinding(ap, "strength");
                    const frequency = createBinding(ap, "frequency");

                    const apLabel = createComputed(() => {
                        let label = ssid() || bssid() || "";
                        if (label.length > apLabelWidth) {
                            label = label.slice(0, apLabelWidth) + "…";
                        }

                        const freq = Number(frequency());
                        if (freq >= 5000) {
                            return label + " 󰩯";
                        } else if (freq >= 2000 && freq < 5000) {
                            return label + " 󰜒";
                        }
                        return label;
                    });

                    const tooltipText = createComputed(() => {
                        return `SSID : ${ssid()}\nMode : ${mode()}\nStrength : ${strength()}\nFrequency : ${frequency()}`;
                    });

                    return (

                        <Gtk.ListBoxRow cssName={"devices-box-row"}>
                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
                                <label
                                    label={apLabel}
                                    tooltipText={tooltipText}
                                    cssName="device-name"
                                    halign={Gtk.Align.START}
                                />
                            </box>
                        </Gtk.ListBoxRow>
                    );
                }}
            </For>
        </Gtk.ListBox>
    ) as Gtk.ListBox;


    const accessPoints = new Gtk.ScrolledWindow({
        hscrollbar_policy: hscroll_policy,
        vscrollbar_policy: vscroll_policy,
        min_content_height: min_height,
    });
    accessPoints.set_child(accessPointsListBox);

    const connectButton = (
        <button cssName="pill-content-button" label="󱛃" tooltipText="discover" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    const disconnectButton = (
        <button cssName="pill-content-button" label="󱛂" tooltipText="pair" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    connectButton.connect("clicked", async () => {
        print(`connecting to ${selectedDevice.ssid}`)

    });

    disconnectButton.connect("clicked", async () => {
        print(`disconnecting from ${selectedDevice.ssid}`)
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <label label="W I R E L E S S" cssName={"pill-content-header"} />
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={5}>
                {connectButton}
                {disconnectButton}
            </box>
            {accessPoints}
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
