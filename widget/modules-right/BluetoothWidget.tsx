import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";
import AstalBluetooth from "gi://AstalBluetooth"
import { For, createBinding, createComputed } from "gnim";

const hscroll_policy = Gtk.PolicyType.NEVER;
const vscroll_policy = Gtk.PolicyType.AUTOMATIC;
const min_height = 100;

export function BluetoothWidget(controller: AccordionController) {

    let selectedDevice: AstalBluetooth.Device;

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
        <Gtk.ListBox
            cssName="devices-box"
            onRowSelected={(self, row) => {
                if (row) {
                    const index = row.get_index();
                    selectedDevice = pairedDevicesList()[index];
                    console.log("Selected:", selectedDevice.name || selectedDevice.address);
                }
            }}
        >
            <For each={pairedDevicesList}>
                {(device) => {
                    return (
                        <Gtk.ListBoxRow cssName={"devices-box-row"}>
                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
                                <label
                                    label={createBinding(device, "name").as(name => name || device.address || "Unknown Device")}
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


    const pairedDevices = new Gtk.ScrolledWindow({
        hscrollbar_policy: hscroll_policy,
        vscrollbar_policy: vscroll_policy,
        min_content_height: min_height,
    });
    pairedDevices.set_child(pairedDevicesBox);

    // Discovered Devices

    const discoveredDevicesList = createComputed(() => {
        const allDevices = devicesBinding() || [];

        return allDevices
            .filter(device => !device.paired)
            .sort((a, b) => {
                const hasRealNameA = !!a.name && a.name.trim().length > 0;
                const hasRealNameB = !!b.name && b.name.trim().length > 0;

                // Devices with real names go first
                if (hasRealNameA && !hasRealNameB) return -1;
                if (!hasRealNameA && hasRealNameB) return 1;

                // If both have names or both don't, sort alphabetically by alias/name
                const labelA = a.name || a.alias || "";
                const labelB = b.name || b.alias || "";

                return labelA.localeCompare(labelB);
            });
    });


    const discoveredDevicesBox = (
        <Gtk.ListBox
            cssName="devices-box"
            onRowSelected={(self, row) => {
                if (row) {
                    const index = row.get_index();
                    selectedDevice = discoveredDevicesList()[index];
                    console.log("Selected:", selectedDevice.name || selectedDevice.address);
                }
            }}
        >
            <For each={discoveredDevicesList}>
                {(device) => {
                    return (
                        <Gtk.ListBoxRow cssName={"devices-box-row"}>
                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
                                <label
                                    label={createBinding(device, "name").as(name => name || device.address || "Unknown Device")}
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

    const discoveredDevices = new Gtk.ScrolledWindow({
        hscrollbar_policy: hscroll_policy,
        vscrollbar_policy: vscroll_policy,
        min_content_height: min_height,
    });
    discoveredDevices.set_child(discoveredDevicesBox);

    const discoverButton = (
        <button cssName="pill-content-button" label="" tooltipText="discover" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    const pairButton = (
        <button cssName="pill-content-button" label="󱄀" tooltipText="pair" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    const unpairButton = (
        <button cssName="pill-content-button" label="󱃿" tooltipText="unpair" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    const connectButton = (
        <button cssName="pill-content-button" label="󰂱" tooltipText="connect" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    discoverButton.connect("clicked", async () => {
        if (!adapter?.discovering) {
            discoverButton.tooltipText = "discovering ...";
            console.log("Starting dscovery");
            adapter.start_discovery();
        }
        else {
            console.log("Stopping discovery");
            discoverButton.tooltipText = "discover";
            adapter.stop_discovery();
        }
    });

    discoverButton.tooltipText = adapter.discovering ? "discovering ..." : "discover";

    pairButton.connect("clicked", async () => {
        if (!selectedDevice) return;

        const deviceName = selectedDevice.name || selectedDevice.address;

        if (selectedDevice.paired) {
            print(`${deviceName} is already paired.`);
            return;
        }

        try {
            if (!adapter.discovering) {
                print("Adapter is not in discoverable state, setting the adapter to discoverable state.")
                adapter.start_discovery();
                adapter.pairable = true;
                adapter.discoverable = true;
            }

            print(`${deviceName} is not paired, pairing.`)
            selectedDevice.pair();
            adapter.stop_discovery();
            adapter.pairable = true;
            adapter.discoverable = true;
            print(`${deviceName} pairing completed.`)

            print(`${deviceName} is not connected, connecting.`)
            selectedDevice.connect_device(() => {
                print(`Connection to ${deviceName} completed.`)
            });

        } catch (err) {
            console.error(err);
        }
    });

    unpairButton.connect("clicked", async () => {
        if (!selectedDevice) return;

        const deviceName = selectedDevice.name || selectedDevice.address;

        if (!selectedDevice.paired) {
            print(`${deviceName} is not paired.`);
            return;
        }

        try {
            print(`${deviceName} is paired, unpairing.`)
            selectedDevice.disconnect_device((dev, res) => {
                try {
                    dev?.disconnect_device_finish(res);
                    print(`${deviceName} unpairing completed.`);
                } catch (err) {
                    print(`Unpairing ${deviceName} failed:`, err);
                }
            });
        } catch (err) {
            console.error(err);
        }
    });

    connectButton.connect("clicked", async () => {
        if (!selectedDevice) return;

        const deviceName = selectedDevice.name || selectedDevice.address;

        if (selectedDevice.connected) {
            print(`${deviceName} is already connected.`);
            return;
        }

        try {
            print(`${deviceName} is not connected, connecting.`)
            selectedDevice.connect_device(() => {
                print(`Connection to ${deviceName} completed.`)
            });

        } catch (err) {
            console.error(err);
        }
    });




    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content" spacing={2}>
            <label label="B L U E T O O T H" cssName={"pill-content-header"} />
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                {discoverButton}
                {pairButton}
                {unpairButton}
                {connectButton}
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
