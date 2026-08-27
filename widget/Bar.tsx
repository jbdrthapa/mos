import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import { Astal, Gdk } from "ags/gtk4"
import { ModulesCenter } from "./modules-center/ModulesCenter"
import { ModulesLeft } from "./modules-left/ModulesLeft"
import { WorkspaceWidget } from "./bar/WorkspaceWidget"
import { ModulesRight } from "./modules-right/ModulesRight"
import { TrayWidget } from "./bar/TrayWidget"
import { PowerProfileWidget } from "./bar/PowerProfileWidget"
import { GraphicsWidget } from "./bar/GraphicsWidget"
import { BatteryWidget } from "./bar/BatteryWidget"
import { DesktopMenu } from "./DesktopMenu"
import { WindowName } from "../constants"
import Dock from "./bar/Dock"
import IPCService from "../services/IPCService"
import WidgetManager from "../WidgetManager"
import PopupWindow from "./PopupWindow"
import { createRoot } from "ags"

let modulesLeft: any;
let modulesCenter: any;
let modulesRight: any;
let settings: typeof PopupWindow;
let dock: any;
let desktopMenu = createRoot(() => DesktopMenu());

const windowName = WindowName.bar;

function CloseAllMenus() {
  modulesCenter.popup.hide_all();
  modulesLeft.popup.hide_all();
  modulesRight.popup.hide_all();
  desktopMenu.hide_all();
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  modulesLeft = new (ModulesLeft as any)();
  modulesCenter = new (ModulesCenter as any)();
  modulesRight = new (ModulesRight as any)();
  settings = WidgetManager.GetSettingsWindow();
  dock = new (Dock as any)();

  const workspaceWidget = WorkspaceWidget();
  const trayWidget = TrayWidget();
  const powerProfileWidget = PowerProfileWidget();
  const graphicsWidget = GraphicsWidget();
  const batteryWidget = BatteryWidget();
  const ipcService = new IPCService();

  const backdropButton = (
    <button cssName="invisible-backdrop" />
  ) as Gtk.Button;

  const backdrop = (
    <window
      name={windowName}
      namespace={windowName}
      layer={Astal.Layer.BACKGROUND}
      visible={true}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      application={app}
      cssName={"invisible-backdrop-window"}
    >
      {backdropButton}
    </window>
  ) as Astal.Window;

  const barWindow = (

    <window
      visible
      name={windowName}
      namespace={windowName}
      class={windowName}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="bar">
        <box $type="start" spacing={10}>
          {modulesLeft}
          {dock}
        </box>
        <box $type="center">
          {modulesCenter}
        </box>
        <box $type="end" spacing={10}>
          {workspaceWidget}
          {trayWidget}
          {powerProfileWidget}
          {graphicsWidget}
          {batteryWidget}
          {modulesRight}
        </box>
      </centerbox>
    </window>

  ) as Astal.Window;

  const backdropButtonGesture = new Gtk.GestureClick();
  backdropButtonGesture.set_button(0); // Listen to all the buttons 
  let offset = 8;
  backdropButtonGesture.connect("pressed", (controller, n_press, x, y) => {
    const button = controller.get_current_button();

    if (button === 1) {
      CloseAllMenus();
    }
    else if (button === 3) {
      // console.log(`Mouse button ${button} pressed at coords: ${x}, ${y}`)
      desktopMenu.marginLeft = x + offset;
      desktopMenu.marginTop = y + offset;
      desktopMenu.toggle();
    }
  });

  backdropButton.add_controller(backdropButtonGesture);

  const barGesture = new Gtk.GestureClick();
  barGesture.connect("pressed", () => {

    hide_others();
  });

  barWindow.add_controller(barGesture);

  function hide_others() {
    app.get_windows().forEach(window => {
      if (window !== barWindow && window.name !== "bar-background") {
        window.hide()
      }
    });
  }

  console.debug("Bar rendered, registering backdrop and popups...");

  app.add_window(backdrop);
  app.add_window(modulesLeft.popup);
  app.add_window(modulesCenter.popup);
  app.add_window(modulesRight.popup);
  app.add_window(desktopMenu);
  app.add_window(settings);

  console.debug("Current windows in app:");
  app.windows.forEach(win => console.log(win.name));

  return barWindow;

}
