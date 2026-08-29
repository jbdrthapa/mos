import Gtk from "gi://Gtk?version=4.0";
import Apps from "gi://AstalApps";
import { Gdk } from "ags/gtk4";
import { For, createState } from "ags";
import { subprocess, execAsync } from "ags/process";

const terminal = "kitty";
let appListing: any;

function launch(app?: Apps.Application) {
    if (!app) return;

    execAsync("niri msg action close-overview");

    const needsTerminal = app.app.get_boolean("Terminal");
    const launchCmd = needsTerminal
        ? `${terminal} -e ${app.executable}`
        : app.executable;

    if (needsTerminal) {
        subprocess(["bash", "-c", `${launchCmd} >/dev/null 2>&1 &`]);
    } else {
        app.launch();
    }
}

function AppItem({ app }: { app: Apps.Application }) {
    const appNameDescLengthMax = 100;

    const appName =
        app.name.length > appNameDescLengthMax
            ? app.name.substring(0, appNameDescLengthMax) + "..."
            : app.name;

    let appDesc: string | undefined;
    if (app.description) {
        appDesc =
            app.description.length > appNameDescLengthMax
                ? app.description.substring(0, appNameDescLengthMax) + "..."
                : app.description;
    }

    let appTooltip = "Application: " + app.name;
    if (app.description !== null) {
        appTooltip += "\nDescription: " + app.description;
    }

    return (
        <button
            css="background: none;"
            onClicked={() => launch(app)}
        >
            <box
                orientation={Gtk.Orientation.HORIZONTAL}
                halign={Gtk.Align.START}
                tooltipText={appTooltip}
                spacing={20}
            >
                <image
                    iconName={app.icon_name || "image-missing"}
                    pixelSize={56}
                    vexpand={true}
                    valign={Gtk.Align.CENTER}
                />
                <box
                    orientation={Gtk.Orientation.VERTICAL}
                    vexpand={true}
                    valign={Gtk.Align.CENTER}
                >
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
    if (appListing) return appListing;

    let searchentry: Gtk.Entry;
    let appsScroll: Gtk.ScrolledWindow;
    let flowBox: Gtk.FlowBox;

    const apps = new Apps.Apps();
    const initialResults = apps.fuzzy_query("");
    const [list, setList] = createState(initialResults);

    function search(text: string) {
        const results =
            text === "" ? apps.fuzzy_query("") : apps.fuzzy_query(text);
        setList(results);
    }

    function onKey(
        _e: Gtk.EventControllerKey,
        keyval: number,
        _: number,
        mod: number,
    ) {
        if (keyval === Gdk.KEY_Escape) {
            appListing.visible = false;
            return true;
        }

        if (mod === Gdk.ModifierType.ALT_MASK) {
            for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
                if (keyval === Gdk[`KEY_${i}`]) {
                    launch(list.peek()[i - 1]);
                    return true;
                }
            }
        }

        return false;
    }

    const searchEntry = (
        <entry
            cssName={"search-entry"}
            $={(ref) => (searchentry = ref)}
            onNotifyText={({ text }) => search(text)}
            onActivate={() => launch(list.peek()[0])}
            placeholderText=""
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
                if (button) button.activate();
            }}
        >
            <For each={list}>
                {(app) => (
                    <Gtk.FlowBoxChild cssName="app-button">
                        <AppItem app={app} />
                    </Gtk.FlowBoxChild>
                )}
            </For>
        </Gtk.FlowBox>
    );

    appListing = (
        <box
            cssName="modules-left-container"
            orientation={Gtk.Orientation.VERTICAL}
        >
            {searchEntry}
            <scrolledwindow
                vexpand
                heightRequest={500}
                hexpand
                widthRequest={800}
                $={(ref) => (appsScroll = ref)}
            >
                {flowBox}
            </scrolledwindow>
        </box>
    ) as any;

    const keyController = new Gtk.EventControllerKey();
    keyController.connect("key-pressed", onKey);
    appListing.add_controller(keyController);

    appListing.connect("notify::visible", () => {
        if (appListing.visible) {
            searchEntry.text = "";
            searchEntry.grab_focus();

            if (appsScroll) {
                const vadjustment = appsScroll.get_vadjustment();
                vadjustment.set_value(vadjustment.get_lower());
            }
        }
    });

    return appListing;
}
