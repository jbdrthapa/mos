import app from "ags/gtk4/app"
import style from "./styles/main.scss"
import Bar from "./widget/Bar"
import NotificationPopups from "./widget/modules-right/NotificationPopups"
import Osd from "./widget/osd/Osd"

app.set_application_id("org.js-shell")
app.version = "1.0"

app.start({
  instanceName: "js-shell",
  css: style,
  main() {
    for (const monitor of app.get_monitors()) {
      Bar(monitor)
      NotificationPopups(monitor)
      Osd(monitor)
    }
  },
})
