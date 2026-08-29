import { Gdk } from "ags/gtk4";
import OsdSpeaker from "./OsdSpeaker";
import OsdMicrophone from "./OsdMicrophone";
import OsdBrightness from "./OsdBrightness";

export default function Osd(gdkmonitor: Gdk.Monitor) {
    const osdSpeaker = OsdSpeaker(gdkmonitor);
    const osdMicrophone = OsdMicrophone(gdkmonitor);
    const osdBrightness = OsdBrightness(gdkmonitor);

    return [osdSpeaker, osdMicrophone, osdBrightness];
}
