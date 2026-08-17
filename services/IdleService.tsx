import GObject from "gi://GObject";
import GLib from "gi://GLib";
import { execAsync } from "ags/process";

const IdleServiceProperties = {

};

class InternalIdleService extends GObject.Object {
    static instance: InternalIdleService;
    static get_default() {
        if (!this.instance) this.instance = new InternalIdleService();
        return this.instance;
    }

    private _idleTimeout: number = 300000; // 5 minutes in milliseconds
    private _timerId: number | null = null;

    constructor() {
        super();
        this.startTimer();
    }

    private turnOffScreens() {
        execAsync(["niri", "msg", "action", "power-off-monitors"])
            .catch(err => console.error("Niri Idle Error:", err));
    }

    private startTimer() {
        if (this._timerId !== null) {
            GLib.source_remove(this._timerId);
            this._timerId = null;
        }

        this._timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, this._idleTimeout, () => {
            this.turnOffScreens();
            this._timerId = null; 
            return GLib.SOURCE_REMOVE; // Stops the timer repeating
        });
    }

    public resetTimer() {
        this.startTimer();
    }

}

const IdleService = GObject.registerClass({ Properties: IdleServiceProperties, }, InternalIdleService);

export default IdleService;