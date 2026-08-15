import { AppListing } from "./AppListing"

export function ModulesLeft() {

    const appListingWindow = AppListing();

    const button = (
        <box>
            <button onClicked={() => appListingWindow.toggle()} cssName={"bar-module-button-left"}>
                <label label="" />
            </button>
        </box>

    ) as any;



    button.popup = appListingWindow;

    return button;
}
