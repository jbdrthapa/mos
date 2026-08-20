import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";
import AstalBluetooth from "gi://AstalBluetooth"
import { For, createBinding, createComputed } from "gnim";

const hscroll_policy = Gtk.PolicyType.NEVER;
const vscroll_policy = Gtk.PolicyType.AUTOMATIC;
const min_height = 100;

export function BluetoothWidget(controller: AccordionController) {

    const bluetooth = AstalBluetooth.get_default();

    const adapter = bluetooth.adapter;

    if (!adapter) {
        return;
    }

    const devicesBinding = createBinding(bluetooth, "devices");

    // Paired Devices 

    const pairedDevicesList = createComputed(() => {
        const allDevices = devicesBinding() || [];
        return allDevices.filter(device => device.paired);
    });

    const pairedDevicesBox = (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4} cssName="devices-box">
            <For each={pairedDevicesList}>
                {(device) => {
                    return (
                        <box>
                            <label
                                label={createBinding(device, "name").as(name => name || device.address || "Unknown Device")}
                                cssName="device-name"
                                halign={Gtk.Align.START}
                            />
                        </box>
                    );
                }}
            </For>
        </box>
    ) as Gtk.Box;

    const pairedDevices = new Gtk.ScrolledWindow({
        hscrollbar_policy: hscroll_policy,
        vscrollbar_policy: vscroll_policy,
        min_content_height: min_height,
    });
    pairedDevices.set_child(pairedDevicesBox);

    // Discovered Devices

    const discoveredDevicesList = createComputed(() => {
        const allDevices = devicesBinding() || [];
        return allDevices.filter(device => !device.paired);
    });

    const discoveredDevicesBox = (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4} cssName="devices-box">
            <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
                <For each={discoveredDevicesList}>
                    {(device) => {
                        return (
                            <box>
                                <label
                                    label={createBinding(device, "name").as(name => name || device.address || "Unknown Device")}
                                    cssName="device-name"
                                    halign={Gtk.Align.START}
                                />
                            </box>
                        );
                    }}
                </For>
            </box>
        </box>
    ) as Gtk.Box;

    const discoveredDevices = new Gtk.ScrolledWindow({
        hscrollbar_policy: hscroll_policy,
        vscrollbar_policy: vscroll_policy,
        min_content_height: min_height,
    });
    discoveredDevices.set_child(discoveredDevicesBox);

    const discoverButton = (
        <button cssName="pill-content-button" label="" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    discoverButton.connect("clicked", async () => {
        if (!adapter?.discovering) {
            discoverButton.tooltipText = "Discovering ...";
            console.log("Starting discovery");
            adapter?.start_discovery();
        }
        else {
            console.log("Stopping discovery");
            discoverButton.tooltipText = "Discovery";
            adapter?.stop_discovery();
        }
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content" spacing={2}>
            <label label="B L U E T O O T H" cssName={"pill-content-header"} />
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                {discoverButton}
            </box>
            {pairedDevices}
            {discoveredDevices}
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
