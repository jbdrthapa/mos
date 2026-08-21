import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import Network from "gi://AstalNetwork"
import { For, createBinding, createComputed } from "gnim";
import { PillWidget } from "./PillWidget";

export function WirelessNetworkWidget(controller: AccordionController) {

    let selectedDevice: Network.AccessPoint;

    const hscroll_policy = Gtk.PolicyType.NEVER;
    const vscroll_policy = Gtk.PolicyType.AUTOMATIC;
    const min_height = 200;
    const apLabelWidth = 15;

    const network = Network.get_default();

    const wifi = network.wifi;

    if (!wifi) {
        return;
    }

    const device = createBinding(wifi, "device");

    const access_points = createBinding(wifi, "accessPoints");

    const active_ap = createBinding(wifi, "activeAccessPoint");

    const active_ap_ssid = createComputed(() => {
        const ap = active_ap();
        return ap ? ap.ssid || ap.bssid || "unknown" : "Not Connected";
    });

    const filtered_accessPoints = createComputed(() => {
        const allAPs = access_points() || [];

        const uniqueMap = new Map();

        for (const ap of allAPs) {
            const ssidStr = ap.ssid || "";
            const bssidStr = ap.bssid || "";
            const freqNum = Number(ap.frequency) || 0;

            const freqBand = freqNum >= 5000 ? "5G" : "2G";

            const identityKey = ssidStr.trim().length > 0
                ? `${ssidStr}_${freqBand}`
                : bssidStr;

            if (!identityKey) continue;

            if (!uniqueMap.has(identityKey) || (ap.strength > uniqueMap.get(identityKey).strength)) {
                uniqueMap.set(identityKey, ap);
            }
        }

        const uniqueAPs = Array.from(uniqueMap.values());

        return [...uniqueAPs].sort((a, b) => {
            const strengthA = a.strength || 0;
            const strengthB = b.strength || 0;

            if (strengthA !== strengthB) {
                return strengthB - strengthA;
            }

            const hasSsidA = !!a.ssid && a.ssid.trim().length > 0;
            const hasSsidB = !!b.ssid && b.ssid.trim().length > 0;

            if (hasSsidA && !hasSsidB) return -1;
            if (!hasSsidA && hasSsidB) return 1;

            const labelA = a.ssid || a.bssid || "";
            const labelB = b.ssid || b.bssid || "";

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
                    const requiresAuth = createBinding(ap, "requiresPassword");

                    const apLabel = createComputed(() => {
                        let label = ssid() || bssid() || "";
                        if (label.length > apLabelWidth) {
                            label = label.slice(0, apLabelWidth) + "…";
                        }
                        return label;
                    });

                    const freqBadge = createComputed(() => {
                        const freq = Number(frequency());
                        if (freq >= 5000) {
                            return "󰩯";
                        } else if (freq >= 2000 && freq < 5000) {
                            return "󰜒";
                        }
                        return "";
                    });

                    const freqClass = createComputed(() => {
                        const freq = Number(frequency());

                        if (freq >= 5000) {
                            return "freq-5g";
                        } else if (freq >= 2000) {
                            return "freq-2g";
                        }
                        return "freq-unknown";
                    });

                    const requires_auth = createComputed(() => {
                        const auth_reqd = requiresAuth();
                        if (auth_reqd) {
                            return "󰌾";
                        }
                        else {
                            return "󱙱";
                        }
                    });

                    const requiresAuthClass = createComputed(() => {
                        const auth_reqd = requiresAuth();

                        if (auth_reqd) {
                            return "auth-required";
                        } else {
                            return "auth-not-required";
                        }
                    });

                    const tooltipText = createComputed(() => {
                        return `SSID : ${ssid()}\nMode : ${mode()}\nStrength : ${strength()}\nFrequency : ${frequency()}\nAuth : ${requiresAuth()}`;
                    });

                    return (
                        <Gtk.ListBoxRow cssName={"devices-box-row"}>
                            <box orientation={Gtk.Orientation.HORIZONTAL}>
                                <label
                                    label={freqBadge}
                                    cssName={freqClass()}
                                    halign={Gtk.Align.START}
                                />
                                <label
                                    label={requires_auth}
                                    cssName={requiresAuthClass()}
                                    halign={Gtk.Align.START}
                                />
                                <label
                                    label={apLabel}
                                    tooltipText={tooltipText}
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
        <button cssName="pill-content-button" label="󱛃" tooltipText="connect" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    const disconnectButton = (
        <button cssName="pill-content-button" label="󱛂" tooltipText="disconnect" vexpand={false} hexpand={false} halign={Gtk.Align.CENTER} />
    ) as Gtk.Button;

    const passphraseWidget = (
        <entry
            cssName={"passphrase-entry"}
            placeholderText="passphrase"
        />
    ) as Gtk.Entry;

    connectButton.connect("clicked", async () => {
        print(`connecting to AP ${selectedDevice.ssid}`);

        const ap = wifi.access_points.find(ap => ap.ssid === selectedDevice.ssid);

        if (!ap) {
            print(`AP not found with matching ssid ${selectedDevice.ssid}`);
            return;
        }

        let ap_name = ap.ssid || ap.bssid || "unknown AP";

        try {
            if (ap.requiresPassword) {
                print(passphraseWidget.text);
                if (passphraseWidget.text == "") {
                    print(`Failed to connect to AP, no passphrase supplied`);
                    return;
                }
                print(`Activating AP ${ap_name} with passphrase`);
                ap.activate(passphraseWidget.text, null);
            } else {
                print(`Activating AP ${ap_name} without passphrase`);
                ap.activate(null, null);
            }

            print(`Connected to AP ${ap_name}`);
        } catch (err) {
            print(`Failed to connect to AP ${ap_name}: ${err}`);
        }
    });

    disconnectButton.connect("clicked", async () => {
        const ap = wifi.active_access_point;

        if (!ap) {
            print("No active Wi‑Fi connection to disconnect.");
            return;
        }

        print(`disconnecting from ${selectedDevice.ssid}`)

        try {
            wifi.deactivate_connection((wifiObj, res) => {
                try {
                    wifiObj?.deactivate_connection_finish(res);
                    print("Disconnected.");
                } catch (err) {
                    print("Failed to disconnect:", err);
                }
            });
        } catch (err) {
            print("Failed to disconnect: Wi-Fi", err);
        }
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content" spacing={2}>
            <label label="W I R E L E S S" cssName={"pill-content-header"} />
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={5}>
                {connectButton}
                {disconnectButton}
            </box>
            {passphraseWidget}
            {accessPoints}
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "wireless-network",
        controller: controller,
        iconName: "",
        title: "Wireless",
        detail: active_ap_ssid,
        content,
    });
}
