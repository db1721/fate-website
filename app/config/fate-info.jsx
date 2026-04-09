import e2 from './../assets/evolve_and_elevate_120.png';
import new_beginnings from './../assets/albums/new-beginnings-cover.png';
import new_beginning from './../assets/albums/new-beginning-cover.png';
import blown_away_single from './../assets/albums/blown-away-cover.png';
import running_away_single from './../assets/albums/running-away-cover.png';
import tell_me_single from './../assets/albums/tell-me-cover.jpg';
import angels from './../assets/albums/angels-single-cover.jpg';
import ugly from './../assets/albums/ugly-single-cover.png';
import passion_single from './../assets/albums/passion-single-cover.png';
import wake_of_determination from './../assets/albums/wake-of-determination.png';
import music_for_all from './../assets/blogs/music-for-all-logo-site.png';
import roadie_music from './../assets/blogs/roadie-music.jpg';

const bandInfo = {
    band_logo: e2,
    band_name: 'F.A.T.E',
    band_name_full: 'Fight Against the Enemy',
    band_description: 'logo',
    band_seo_description: 'logo',

    // Placeholder
    FEATURED_TRACK: {
        title: "Ugly",
        subtitle: "Featured Single",
        coverSrc: ugly,
        audioSrc: "/audio/new-beginnings/ugly-feature.mp3",
    },

    // Placeholder
    // FEATURED_TRACK: {
    //     title: "Friends",
    //     subtitle: "Featured Single",
    //     coverSrc: friends,
    //     audioSrc: "/audio/new-beginnings/friends-feature.mp3",
    // },

    MAIN_BAND_PAGE: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL",
    SOCIAL_LINKS: [
        { url: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL", network: "spotify", tooltip: 'Spotify' },
        { url: "https://music.apple.com/us/artist/fight-against-the-enemy/1857463372", network: "apple", tooltip: 'Apple' },
        { url: "https://music.youtube.com/channel/UCiJwczqQ64-8z2rNQZ3ejdA", network: "youtube-music", tooltip: 'YouTube Music' },
        { url: "https://music.amazon.com/artists/B0G5GVX5KJ/fight-against-the-enemy", network: "amazon", tooltip: 'Amazon' },
        { url: "https://www.pandora.com/artist/fight-against-the-enemy/ARcjJrbl6cx5gnc", network: "pandora", tooltip: 'Pandora' },
        // { url: "https://soundcloud.com/", network: "soundcloud", tooltip: 'SoundCloud' },
        { url: "https://tidal.com/artist/70888371", network: "tidal", tooltip: 'Tidal' },
        { url: "https://www.deezer.com/us/artist/360343182", network: "deezer", tooltip: 'Deezer' },
        // { url: "https://www.shazam.com/artist/-/1857463372", network: "shazam", tooltip: 'Shazam' },
        { url: "https://www.youtube.com/@FightAgainstTheEnemyMusic", network: "youtube", tooltip: 'YouTube' },
        { url: "https://www.tiktok.com/@fight_against_the_enemy", network: "tiktok", tooltip: 'TikTok' },
        { url: "https://www.instagram.com/fight_against_the_enemy", network: "instagram", tooltip: 'Instagram'},
        { url: "https://www.facebook.com/61584405977665", network: "facebook", tooltip: 'Facebook' },
        { url: "https://x.com/F_A_T_E_music", network: "x", tooltip: 'X' },
    ],

    ALBUMS: [
        {
            id: "new-beginnings",
            title: "New Beginnings",
            year: 2026,
            description: "Planned Release TBD",
            coverSrc: new_beginnings,
            tracks: [
                {
                    title: "New Beginning",
                    audioSrc: "/audio/new-beginnings/new-beginning.mp3",
                    songImg: new_beginning,
                    storyBehindTheLyrics: "",
                    single_link_share: "https://ffm.to/fate-new-beginning",
                    releaseDate: "12/05/2025"
                },
                {
                    title: "Angels",
                    audioSrc: "/audio/new-beginnings/angels.mp3",
                    songImg: angels,
                    storyBehindTheLyrics: "",
                    single_link_share: "https://ffm.to/fate-angels",
                    releaseDate: "3/15/2026"
                },
                {
                    title: "Blown Away",
                    audioSrc: "/audio/new-beginnings/blown-away.mp3",
                    songImg: blown_away_single,
                    storyBehindTheLyrics: "",
                    single_link_share: "https://ffm.to/fate-blown-away",
                    releaseDate: "12/23/2025"
                },
                {title: "Lost and Afraid", audioSrc: "/audio/new-beginnings/lost-and-afraid.mp3", releaseDate: ""},
                {
                    title: "Tell Me",
                    audioSrc: "/audio/new-beginnings/tell-me.mp3",
                    songImg: tell_me_single,
                    storyBehindTheLyrics: "",
                    single_link_share: "https://ffm.to/fate-tell-me",
                    releaseDate: "02/28/2026"
                },
                {
                    title: "Running Away",
                    audioSrc: "/audio/new-beginnings/running-away.mp3",
                    songImg: running_away_single,
                    storyBehindTheLyrics: "",
                    single_link_share: "https://ffm.to/fate-running-away",
                    releaseDate: "02/16/2026"
                },
                {title: "Friends", audioSrc: "/audio/new-beginnings/friends.mp3", releaseDate: ""},
                {title: "Fully Alive", audioSrc: "/audio/new-beginnings/fully-alive.mp3", releaseDate: ""},
                {title: "No More Games", audioSrc: "/audio/new-beginnings/no-more-games.mp3", releaseDate: ""},
                {
                    title: "Passion",
                    audioSrc: "/audio/new-beginnings/passion.mp3",
                    songImg: passion_single,
                    storyBehindTheLyrics: "",
                    single_link_share: "https://ffm.to/fate-passion",
                    releaseDate: "12/22/2025"
                },
                {title: "Hold My Hand", audioSrc: "/audio/new-beginnings/hold-my-hand.mp3", releaseDate: ""},
                {
                    title: "Ugly",
                    audioSrc: "/audio/new-beginnings/ugly.mp3",
                    songImg: ugly,
                    lyricsFile: "/lyrics/new-beginnings/ugly.txt",
                    storyBehindTheLyrics: "",
                    previewStartTime: 206,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/63gEItrCSEEslMEBR8D5v0", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/ugly/1884149137?i=1884149138&app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0GS437Z12/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=EaLaIPN7x6E", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fugly%2Fugly%2FTR5bPjX7w4b2qjg&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A196970543&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A196970543&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "https://www.tidal.com/track/505959659", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3893040501", network: "deezer", tooltip: 'Deezer' },
                    ],
                    single_link_share: "https://ffm.to/fate-ugly",
                    spotifyUrl: "https://open.spotify.com/track/63gEItrCSEEslMEBR8D5v0",
                    appleUrl: "https://geo.music.apple.com/us/album/ugly/1884149137?i=1884149138&app=music&ls=1",
                    amazonUrl: "https://music.amazon.com/tracks/B0GS437Z12/?ref=dm_ff_amazonmusic_3p",
                    youtubeUrl: "https://music.youtube.com/watch?v=EaLaIPN7x6E",
                    releaseDate: "3/29/2026"
                },
            ]
        },
        {
            id: "wake-of-determination",
            title: "Wake of Determination",
            year: 2026,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: wake_of_determination,
            tracks: [
                { title: "Brand New Day", audioSrc: "/audio/wake-of-determination/brand-new-day.mp3", releaseDate: ""  },
                { title: "Encompassing Defeat", audioSrc: "/audio/wake-of-determination/encompassing-defeat.mp3", releaseDate: ""  },
                { title: "Wake of Determination", audioSrc: "/audio/wake-of-determination/wake-of-determination.mp3", releaseDate: ""  },
            ],
        },
        ],


    BLOGS: [
        {
            title: "Roadie Music",
            excerpt:
                "Fight Against the Enemy's \"New Beginning\" showcases instrumental strength and emotion right from the band's debut.",
            href: "https://roadie-music.com/new-beginning-da-fight-against-the-enemy-mostra-forca-instrumental-e-emocao-logo-na-estreia-da-banda/",
            date: "2025-12-15",
            coverSrc: roadie_music,
            tag: "New Beginning",
        },
        {
            title: "Music For All",
            excerpt:
                "Fight Against The Enemy delivers a positive message amidst aggressive and dark music",
            href: "https://musicforall.com.br/fight-against-the-enemy-traz-mensagem-positiva-em-meio-a-musica-agressiva-e-sombria/",
            date: "2025-12-15",
            coverSrc: music_for_all,
            tag: "New Beginning",
        },
    ],

    // Colors
    colors:
        {
            plain_white: "#ffffff",
            main: "#253e8f",
            secondary_light: "#f5f3a5",
            secondary_dark: "#323461",
            secondary_light_offset: "#F4D160",
            title_gradient: "radial-gradient(circle at 100% 100%, #ffffff 0%, #F4D160 100%)",
            title_gradient_alt: "radial-gradient(circle at 100% 100%, #ffffff 0%, #253e8f 100%)",
            gradient_bar: "radial-gradient(circle at 100% 100%, rgba(50, 52, 97, 1) 0%, rgba(37, 62, 143, 1) 100%)",
        },
};


export default bandInfo;

