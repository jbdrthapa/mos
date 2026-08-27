import Gtk from "gi://Gtk?version=4.0"
import Apps from "gi://AstalApps"
import PopupWindow from "../PopupWindow"
import { Astal, Gdk } from "ags/gtk4"
import { For, createState } from "ags";
import { subprocess } from "ags/process";
import { WindowName } from "../../constants"
import { execAsync } from "ags/process";

const windowName = WindowName.modulesLeft;

const terminal = "kitty";
let appListingWindow: any;

function launch(app?: Apps.Application) {
    if (app) {
        appListingWindow.hide()

        execAsync("niri msg action close-overview");

        // Check if the .desktop file has Terminal=true
        const needsTerminal = app.app.get_boolean("Terminal");

        const launchCmd = needsTerminal
            ? `${terminal} -e ${app.executable}`
            : app.executable;
        if (needsTerminal) {
            subprocess(["bash", "-c", `${launchCmd} >/dev/null 2>&1 &`]);
        }
        else {
            app.launch()
        }
    }
}


function AppItem({ app }: { app: Apps.Application }) {

    const appNameDescLengthMax = 100;
    const appName = app.name.length > appNameDescLengthMax
        ? app.name.substring(0, appNameDescLengthMax) + "..."
        : app.name;

    let appDesc;
    if (app.description) {
        appDesc = app.description.length > appNameDescLengthMax
            ? app.description.substring(0, appNameDescLengthMax) + "..."
            : app.description;
    }

    let appTooltip = "Application: " + app.name;

    if (app.description !== null) {
        appTooltip += "\n" + "Description: " + app.description;
    }

    return (
        <button css="background-color: transparent;"
            onClicked={() => {
                appListingWindow.hide_all();
                launch(app);
            }}
        >
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.START} tooltipText={appTooltip} spacing={20}>
                <image
                    iconName={app.icon_name || "image-missing"}
                    pixelSize={52}
                    cssName="app-icon"
                />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label
                        label={appName}
                        cssName="app-name"
                        halign={Gtk.Align.START}
                    />
                    <label
                        label={appDesc}
                        cssName="app-desc"
                        halign={Gtk.Align.START}
                    />
                </box>
            </box>
        </button>
    );
}

export function AppListing() {

    if (appListingWindow) {
        return appListingWindow;
    }

    let searchentry: Gtk.Entry
    let appsScroll: Gtk.ScrolledWindow
    let win: Astal.Window
    let flowBox: Gtk.FlowBox

    const apps = new Apps.Apps();
    const initialResults = apps.fuzzy_query("")
    const [list, setList] = createState(initialResults)

    function search(text: string) {
        const results = text === "" ? apps.fuzzy_query("") : apps.fuzzy_query(text)
        setList(results)
    }


    // handle key events for the entire window
    function onKey(
        _e: Gtk.EventControllerKey,
        keyval: number,
        _: number,
        mod: number,
    ) {
        console.log("Key pressed", Gdk.keyval_name(keyval), "with modifier", mod);
        if (keyval === Gdk.KEY_Escape) {
            appListingWindow.visible = false
            return true
        }

        if (mod === Gdk.ModifierType.ALT_MASK) {
            for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
                if (keyval === Gdk[`KEY_${i}`]) {
                    launch(list.peek()[i - 1])
                    return true
                }
            }
        }

        return false
    }

    let listRoot = new Gtk.Box();
    listRoot.orientation = Gtk.Orientation.VERTICAL;

    const searchEntry = (
        <entry
            cssName={"search-entry"}
            $={(ref) => (searchentry = ref)}
            onNotifyText={({ text }) => search(text)}
            onActivate={() => launch(list.peek()[0])}
            placeholderText=">"
        />
    ) as any;

    flowBox = (
        <Gtk.FlowBox
            vexpand
            hexpand
            selectionMode={Gtk.SelectionMode.SINGLE}
            activate_on_single_click={true}
            columnSpacing={0}
            rowSpacing={10}
            minChildrenPerLine={1}
            maxChildrenPerLine={1}
            homogeneous={false}
            valign={Gtk.Align.START}
            halign={Gtk.Align.START}
            onChildActivated={(self, child) => {
                const button = child.child;
                if (button) {
                    button.activate();
                }
            }}
        >
            <For each={list}>
                {(app) => (
                    <Gtk.FlowBoxChild cssName="app-tile">
                        <AppItem app={app} />
                    </Gtk.FlowBoxChild>
                )}
            </For>
        </Gtk.FlowBox>
    )


    appListingWindow = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP,
        child: (
            <box cssName="modules-left-container" orientation={Gtk.Orientation.VERTICAL}>
                {searchEntry}
                <scrolledwindow vexpand heightRequest={500} hexpand widthRequest={800} $={(ref) => (appsScroll = ref)}>
                    {flowBox}
                </scrolledwindow>
            </box>
        )
    });

    // subscribe to key events for the entire window
    const keyController = new Gtk.EventControllerKey();
    keyController.connect("key-pressed", onKey);
    appListingWindow.add_controller(keyController);

    // connect to visibility changes
    appListingWindow.connect("notify::visible", () => {
        if (appListingWindow.visible) {

            // console.log("Launcher window is opened");

            // reset search and focus
            searchEntry.text = "";
            searchEntry.grab_focus();

            // scroll to top
            if (appsScroll) {
                const vadjustment = appsScroll.get_vadjustment()
                vadjustment.set_value(vadjustment.get_lower())
            }
        }
        else {

            // console.log("Launcher window is closed");
        }
    });

    return appListingWindow;
}
