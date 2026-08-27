import { AppListing } from "./AppListing"
import Gtk from "gi://Gtk?version=4.0"

export function ModulesLeft() {

    const appListingWindow = AppListing();

    const button = (
        <button onClicked={() => appListingWindow.toggle()} cssName={"bar-module-button"}>
            <label label="" />
        </button>
    ) as any;



    button.popup = appListingWindow;

    return button;
}
