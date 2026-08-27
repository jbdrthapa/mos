import Apps from "gi://AstalApps"
import { execAsync } from "ags/process";
import Config from "../../conf/Config";

const appsService = new Apps.Apps()

const DOCK_LAUNCHERS = Config.GetDockLaunchers();

export default function Dock() {
    return (
        <box>
            {DOCK_LAUNCHERS.map(appName => {
                const app: Apps.Application = appsService.fuzzy_query(appName)?.[0]
                    || appsService.get_list().find(a => a.name.toLowerCase().includes(appName.toLowerCase()))

                if (!app) {

                    return (
                        <button cssName="dock-item dead" tooltipText={`Missing: ${appName}`}>
                            <image iconName="image-missing" pixelSize={26} />
                        </button>
                    )
                }

                return (
                    <button
                        cssName="dock-item"
                        tooltipText={`${app.name}\n${app.description || "Application Launcher"}`}
                        onClicked={() => {
                            execAsync("niri msg action close-overview");
                            app.launch()
                        }}>
                        <image iconName={app.icon_name || "application-x-executable"} pixelSize={26} />
                    </button>
                )
            })}
        </box>
    )
}
