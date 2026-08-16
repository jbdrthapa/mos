import { AppListing } from "./AppListing"

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
