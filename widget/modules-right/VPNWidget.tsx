import Gtk from "gi://Gtk?version=4.0";
import { createState, createBinding, createComputed } from "gnim";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";
import NM from "gi://NM?version=1.0";

const client = NM.Client.new(null);

export function isConnectionActive(conn: NM.RemoteConnection): boolean {
    const uuid = conn.get_uuid();
    const active = client.get_active_connections();

    return active.some(ac => {
        const c = ac.get_connection();
        return c && c.get_uuid() === uuid;
    });
}

export function getActiveConnection(conn: NM.RemoteConnection): NM.ActiveConnection | null {
    const uuid = conn.get_uuid();
    const active = client.get_active_connections();

    for (const ac of active) {
        const c = ac.get_connection();
        if (c && c.get_uuid() === uuid) return ac;
    }
    return null;
}

export function toggleConnection(conn: NM.RemoteConnection) {
    const active = getActiveConnection(conn);

    if (active) {
        client.deactivate_connection(active, null);
        return;
    }

    client.activate_connection_async(
        conn,
        null,
        null,
        null,
        (client, res) => {
            try {
                client?.activate_connection_finish(res);
            } catch (e) {
                logError(e);
            }
        }
    );
}

export function VPNWidget(controller: AccordionController) {


    const connections = client.connections;

    const vpnConnections = connections.filter(conn => {
        const settings = conn.get_setting_connection();
        if (!settings) return false;

        const type = settings.get_connection_type();
        return type === "vpn" || type === "wireguard";
    });

    const [nmState, setNmState] = createState(0);

    const vpn = vpnConnections[0];

    const activeState = createComputed(() => {
        nmState();
        const activeConnection = getActiveConnection(vpn);
        const connection_id = activeConnection?.get_id();
        const id = connection_id && connection_id.length > 10 ? connection_id.slice(0, 10) + "…" : connection_id;

        return vpn ? (isConnectionActive(vpn) ? id : "Disconnected") : "No VPN";
    });

    client.connect("notify::active-connections", () => {
        setNmState(nmState() + 1);
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={12} cssName="pill-content">
            <label label="V P N" cssName={"pill-content-header"} />

            {vpnConnections.map(conn => {
                const id = conn.get_id();
                const uuid = conn.get_uuid();
                return (
                    <label label={`${id}`} />
                );
            })}

        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "vpn",
        controller: controller,
        iconName: "󰯅",
        title: "VPN",
        detail: activeState,
        content,
    });
}
