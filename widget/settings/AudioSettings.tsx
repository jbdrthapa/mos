import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding, createComputed } from "gnim";
import AstalWp from "gi://AstalWp?version=0.1";
import Utils from "../../Utils";

export function AudioSettings() {

    const wp = AstalWp.get_default();

    const speakersRawBinding = createBinding(wp.audio, "speakers");

    const speakersBinding = createComputed(() => { return speakersRawBinding() || []; });

    const microphonesRawBinding = createBinding(wp.audio, "microphones");

    const microphonesBinding = createComputed(() => { return microphonesRawBinding() || []; });


    //      ===================================================
    //                  AUDIO SETTINGS
    //      ===================================================
    //      [🔊] Headphones (Built-in Audio)     [★ Default]
    //      -------------------------------------------------
    //      Layout: Stereo  |  State: Active  |  Muted: False

    //      Channel Volumes:
    //      左 Front Left   [=============|---------]  60%
    //      右 Front Right  [=============|---------]  60%

    //      [🔈] Monitor (HDMI Audio Output)     [Set Default]
    //      -------------------------------------------------
    //      Layout: 5.1     |  State: Idle    |  Muted: True


    const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/mos`;

    const CHANNEL_LAYOUT: Record<number, [string, string]> = {
        0: [`${CONFIG_DIR}/assets/speaker_layout/unknown.svg`, "Unknown"],
        1: [`${CONFIG_DIR}/assets/speaker_layout/mono.svg`, "Mono"],
        2: [`${CONFIG_DIR}/assets/speaker_layout/stereo.svg`, "Stereo"],
        4: [`${CONFIG_DIR}/assets/speaker_layout/quad.svg`, "Quadraphonic"],
        6: [`${CONFIG_DIR}/assets/speaker_layout/5p1_surround.svg`, "5.1 Surround"],
        8: [`${CONFIG_DIR}/assets/speaker_layout/7p1_surround.svg`, "7.1 Surround"]
    };

    const NODE_STATE: Record<number, [string, string]> = {
        0: [`${CONFIG_DIR}/assets/node_state/node_state_0_creating.svg`, "Creating"],              // ASTAL_WP_NODE_STATE_CREATING
        1: [`${CONFIG_DIR}/assets/node_state/node_state_1_suspended.svg`, "Suspended"],             // ASTAL_WP_NODE_STATE_SUSPENDED
        2: [`${CONFIG_DIR}/assets/node_state/node_state_2_idle.svg`, "Idle"],                  // ASTAL_WP_NODE_STATE_IDLE
        3: [`${CONFIG_DIR}/assets/node_state/node_state_3_running.svg`, "Running"],               // ASTAL_WP_NODE_STATE_RUNNING
    };

    const GENERAL: Record<string, [string, string]> = {
        "lock": [`${CONFIG_DIR}/assets/general/locked.svg`, "Lock"],
    };

    const SPEAKER_CHANNEL: Record<string, [string, string]> = {
        "FL": [`${CONFIG_DIR}/assets/channel/front-left.svg`, "Front Left"],
        "FR": [`${CONFIG_DIR}/assets/channel/front-right.svg`, "Front Right"],
        "FC": [`${CONFIG_DIR}/assets/channel/front-center.svg`, "Front Center"],
        "LFE": [`${CONFIG_DIR}/assets/channel/subwoofer.svg`, "Subwoofer"],
        "SL": [`${CONFIG_DIR}/assets/channel/surround-left.svg`, "Surround Left"],
        "SR": [`${CONFIG_DIR}/assets/channel/surround-right.svg`, "Surround Right"],
    };

    const MEDIA_CLASS: Record<number, string> = {
        0: `${CONFIG_DIR}/assets/media_class/media_0_unknown.svg`,                   // ASTAL_WP_MEDIA_CLASS_UNKNOWN
        1: `${CONFIG_DIR}/assets/media_class/media_1_audio_microphone.svg`,          // ASTAL_WP_MEDIA_CLASS_AUDIO_MICROPHONE
        2: `${CONFIG_DIR}/assets/media_class/media_2_audio_speaker.svg`,             // ASTAL_WP_MEDIA_CLASS_AUDIO_SPEAKER
        3: `${CONFIG_DIR}/assets/media_class/media_3_audio_recorder.svg`,            // ASTAL_WP_MEDIA_CLASS_AUDIO_RECORDER
        4: `${CONFIG_DIR}/assets/media_class/media_4_audio_stream.svg`,              // ASTAL_WP_MEDIA_CLASS_AUDIO_STREAM
        5: `${CONFIG_DIR}/assets/media_class/media_5_video_source.svg`,              // ASTAL_WP_MEDIA_CLASS_VIDEO_SOURCE
        6: `${CONFIG_DIR}/assets/media_class/media_6_video_sink.svg`,                // ASTAL_WP_MEDIA_CLASS_VIDEO_SINK
        7: `${CONFIG_DIR}/assets/media_class/media_7_video_recorder.svg`,            // ASTAL_WP_MEDIA_CLASS_VIDEO_RECORDER
        8: `${CONFIG_DIR}/assets/media_class/media_8_video_stream.svg`,              // ASTAL_WP_MEDIA_CLASS_VIDEO_STREAM
        9: `${CONFIG_DIR}/assets/media_class/media_9_audio_source_virtual`,          // ASTAL_WP_MEDIA_CLASS_AUDIO_SOURCE_VIRTUAL
    }

    return (

        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Audio Settings" halign={Gtk.Align.START} cssName="section-heading" />

            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={40}>
                <For each={speakersBinding}>

                    {(speaker) => {

                        const description = createComputed(() => {
                            const rawDesc = createBinding(speaker, "description");
                            return rawDesc() ?? "Unknown Device";
                        });

                        const volumeIcon = createComputed(() => {
                            const rawIcon = createBinding(speaker, "volumeIcon");
                            return rawIcon() ?? "audio-volume-muted";
                        });

                        const nodeStateIconPath = createComputed(() => {
                            const rawState = createBinding(speaker, "state");
                            return NODE_STATE[rawState()][0] ?? "?";
                        });
                        const nodeState = createComputed(() => {
                            const rawState = createBinding(speaker, "state");
                            return NODE_STATE[rawState()][1] ?? "?";
                        });

                        const mediaClassIconPath = createComputed(() => {
                            const rawMediaClass = createBinding(speaker, "mediaClass");
                            return MEDIA_CLASS[rawMediaClass()] ?? "?";
                        });

                        const layoutIconPath = createComputed(() => {
                            const rawLayout = createBinding(speaker, "channels");
                            const channelsArray = rawLayout() || [];
                            const count = channelsArray.length;
                            return CHANNEL_LAYOUT[count][0] ?? "?";
                        });

                        const layoutName = createComputed(() => {
                            const rawLayout = createBinding(speaker, "channels");
                            const channelsArray = rawLayout() || [];
                            const count = channelsArray.length;
                            return CHANNEL_LAYOUT[count][1] ?? "?";
                        });

                        const isDefault = createBinding(speaker, "isDefault");

                        const isMute = createBinding(speaker, "mute");

                        const lockIconPath = GENERAL["lock"][0];

                        const lockLabel = GENERAL["lock"][1];

                        const lockChannels = createBinding(speaker, "lockChannels");

                        return (


                            <box spacing={20} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
                                    <image file={mediaClassIconPath} iconSize={Gtk.IconSize.LARGE} cssName="settings-param-icon" halign={Gtk.Align.START} />
                                    <label label={description} cssName="settings-param-heading" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                    <label label="Icon" xalign={0} cssName="settings-param-caption" />
                                    <label label={volumeIcon} cssName="settings-param-value" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="Muted" xalign={0} cssName="settings-param-caption" />
                                    <Gtk.Switch
                                        active={isMute}
                                        hexpand={false}
                                        vexpand={false}
                                        halign={Gtk.Align.END}
                                        valign={Gtk.Align.CENTER}
                                        onNotifyActive={(self) => {
                                            speaker.mute = self.active;
                                        }} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                    <label label="Default" xalign={0} cssName="settings-param-caption" />
                                    <Gtk.Switch
                                        active={isDefault}
                                        hexpand={false}
                                        vexpand={false}
                                        halign={Gtk.Align.END}
                                        valign={Gtk.Align.CENTER}
                                        onNotifyActive={(self) => {
                                            speaker.isDefault = self.active;
                                        }} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={40}>
                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                                        <For each={createComputed(() => speaker.channels || [])}>
                                            {(channel: any) => {

                                                const channelVolume = createBinding(channel, "volume");

                                                const volumeText = createComputed(() => `${Math.round(channelVolume() * 100)}`);

                                                const channelIconPath = createComputed(() => {
                                                    const rawChannelName = createBinding(channel, "name");
                                                    return SPEAKER_CHANNEL[rawChannelName()][0];
                                                })

                                                const channelName = createComputed(() => {
                                                    const rawChannelName = createBinding(channel, "name");
                                                    return SPEAKER_CHANNEL[rawChannelName()][1];
                                                })

                                                return (

                                                    <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10} marginStart={15}>
                                                        <image file={channelIconPath} tooltipText={channelName} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.CENTER} />
                                                        <slider
                                                            cssClasses={["slider-control"]}
                                                            tooltipText={volumeText}
                                                            widthRequest={280}
                                                            onChangeValue={({ value }) => channel.set_volume(value)}
                                                            value={channelVolume} />
                                                        <label label={volumeText} cssName={"settings-param-value-compact"} css="min-width: 50px;" />
                                                    </box>

                                                );
                                            }}

                                        </For>
                                    </box>
                                    <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                        <image file={lockIconPath} pixelSize={48} tooltipText={lockLabel} cssName="settings-param-icon" halign={Gtk.Align.START} />
                                        <Gtk.Switch
                                            active={lockChannels}
                                            hexpand={false}
                                            vexpand={false}
                                            halign={Gtk.Align.END}
                                            valign={Gtk.Align.CENTER}
                                            onNotifyActive={(self) => {
                                                speaker.lockChannels = self.active;
                                            }} />
                                    </box>
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3} marginTop={20}>
                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                        <image file={layoutIconPath} tooltipText={layoutName} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.CENTER} />
                                        <label label={layoutName} xalign={0.5} cssName="settings-param-caption" />
                                    </box>

                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                        <image file={nodeStateIconPath} tooltipText={nodeState} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.CENTER} />
                                        <label label={nodeState} xalign={0.5} cssName="settings-param-caption" />
                                    </box>
                                </box>
                            </box>
                        )
                    }}
                </For >
            </box>

        </box >

    );
}


