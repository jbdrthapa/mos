import AstalMpris from "gi://AstalMpris?version=0.1";
import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding } from "ags"

export function MprisWidget() {

    const mpris = AstalMpris.get_default()
    const players = createBinding(mpris, "players")

    // function returns media cover art, if available, otherwise returns a default icon

    function MediaCoverArt({ mprisPlayer }: { mprisPlayer: AstalMpris.Player }) {
        const playingClass = createBinding(mprisPlayer, "playbackStatus").as(s =>
            s === AstalMpris.PlaybackStatus.PLAYING ? "playing" : ""
        );

        const coverArt = createBinding(mprisPlayer, "coverArt");

        return (
            <box
                overflow={Gtk.Overflow.HIDDEN}
                cssName="mpris-cover-art"
                cssClasses={playingClass.as(cls => [cls])}
            >
                <image pixelSize={64} file={coverArt} />
            </box>
        );
    }

    // Function returns media information such as title and artist, and truncates it if it's too long

    function MediaInfo({ mprisPlayer }: { mprisPlayer: AstalMpris.Player }) {

        const textWidth = 27;

        const title = createBinding(mprisPlayer, "title")

        const titleText = title.as((value) => {
            const text = String(value ?? "")
            return text.length > textWidth ? text.slice(0, textWidth) + "…" : text
        })

        const artist = createBinding(mprisPlayer, "artist")

        const artistText = artist.as((value) => {
            const text = String(value ?? "")
            return text.length > textWidth ? text.slice(0, textWidth) + "…" : text
        })

        return (
            <box valign={Gtk.Align.CENTER} halign={Gtk.Align.FILL} orientation={Gtk.Orientation.VERTICAL} cssName={"mpris-media-info"}>
                <label xalign={0} label={titleText} tooltipText={title} cssName={"mpris-title"} />
                <label xalign={0} label={artistText} tooltipText={artist} cssName={"mpris-artist"} />
            </box>
        );
    }

    // Function returns media playback buttons such as previous, play/pause, and next, and only shows them if the player supports them

    function MediaPlaybackButtons({ mprisPlayer }: { mprisPlayer: AstalMpris.Player }) {

        const canGoPrevious = createBinding(mprisPlayer, "canGoPrevious")
        const canControl = createBinding(mprisPlayer, "canControl")
        const canGoNext = createBinding(mprisPlayer, "canGoNext")
        const playbackStatus = createBinding(mprisPlayer, "playbackStatus",)((s) => s === AstalMpris.PlaybackStatus.PLAYING)
        const playbackStatusNot = playbackStatus.as((status) => !status)


        return (
            <box hexpand spacing={2} halign={Gtk.Align.END} valign={Gtk.Align.CENTER}>

                <button onClicked={() => mprisPlayer.previous()} visible={canGoPrevious} cssName="mpris-button">
                    <image iconName="media-seek-backward-symbolic" />
                </button>

                <button onClicked={() => mprisPlayer.play_pause()} visible={canControl} cssName="mpris-button">
                    <box>
                        <image iconName="media-playback-start-symbolic" visible={playbackStatusNot} />
                        <image iconName="media-playback-pause-symbolic" visible={playbackStatus} />
                    </box>
                </button>

                <button onClicked={() => mprisPlayer.next()} visible={canGoNext} cssName="mpris-button">
                    <image iconName="media-seek-forward-symbolic" />
                </button>

            </box>
        );
    }


    return (
        <box marginBottom={40} marginStart={20} marginEnd={20}>
            <box spacing={20} orientation={Gtk.Orientation.VERTICAL}>
                <For each={players}>
                    {(player) => (

                        <box>
                            {/* Cover art */}
                            {MediaCoverArt({ mprisPlayer: player })}

                            {/* Title and Artist */}
                            {MediaInfo({ mprisPlayer: player })}

                            {/* Previous, Play/Pause, Next buttons */}
                            {MediaPlaybackButtons({ mprisPlayer: player })}
                        </box>
                    )}
                </For>
            </box>
        </box>
    );
}