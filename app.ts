import app from "ags/gtk4/app";
import style from "./styles/main.scss";
import Bar from "./widget/Bar";
import NotificationPopups from "./widget/modules-right/NotificationPopups";
import Osd from "./widget/osd/Osd";

app.set_application_id("org.mos");
app.set_version("1.0");

app.start({
  instanceName: "mos",
  css: style,
  main() {
    for (const monitor of app.get_monitors()) {
      const bar = Bar(monitor);
      app.add_window(bar);

      const popups = NotificationPopups(monitor);
      app.add_window(popups);

      const osdWindows = Osd(monitor);
      osdWindows.forEach(win => app.add_window(win));
    }
  },
});