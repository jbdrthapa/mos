import GObject from "gi://GObject";
import app from "ags/gtk4/app"
import { AppListing } from "../widget/settings/apps/AppListing"
import { LockScreen } from "../widget/LockScreen";
import DisplayService from "./DisplayService";
import WidgetManager from "../WidgetManager"

const IPCServiceProperties = {

};

class InternalIPCService extends GObject.Object {
    static instance: InternalIPCService;
    static get_default() {
        if (!this.instance) this.instance = new InternalIPCService();
        return this.instance;
    }

    constructor() {
        super();

        let displayService = DisplayService.get_default();

        let lockScreen = LockScreen();

        app.connect("request", (app, request, response) => {
            const command = request[0];

            switch (command) {
                case "launch-apps":
                    let settings = WidgetManager.GetSettingsWindow();
                    settings?.Apps();
                    settings?.toggle();
                    response("Launching apps");
                    break;
                case "increase-brightness":
                    displayService.increaseBrightness();
                    response("Increase Brightness");
                    break;
                case "decrease-brightness":
                    displayService.decreaseBrightness();
                    response("Decrease Brightness");
                    break;
                case "lock-screen":
                    lockScreen.show();
                    response("Lock Screen");
                    break;
                default:
                    response(`ERROR: Unknown request command '${command}'`);
                    break;
            }
        });
    }
}

const IPCService = GObject.registerClass({ Properties: IPCServiceProperties, }, InternalIPCService);

export default IPCService;