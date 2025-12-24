import e2 from './../assets/evolve_and_elevate_120.png';
import new_beginnings from './../assets/albums/new-beginnings-cover.png';
import new_beginning from './../assets/albums/new-beginning-cover.png';
import blown_away_single from './../assets/albums/blown-away-cover.png';
import passion_single from './../assets/albums/passion-single-cover.png';
import wake_of_determination from './../assets/albums/wake-of-determination.png';

const bandInfo = {
    band_logo: e2,
    band_name: 'F.A.T.E',
    band_name_full: 'Fight Against the Enemy',
    band_description: 'logo',
    band_seo_description: 'logo',

    FEATURED_TRACK: {
        title: "Blown Away",
        subtitle: "Featured Single",
        coverSrc: blown_away_single,
        audioSrc: "/audio/new-beginnings/blown-away-feature.mp3",
        link: "https://social.tunecore.com/linkShare?linkid=ovJ1G2ylupbvjscfciA2hQ",
    },

    MAIN_BAND_PAGE: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL",
    SOCIAL_LINKS: [
        { url: "https://music.apple.com/us/artist/fight-against-the-enemy/1857463372", network: "apple", tooltip: 'Apple' },
        { url: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL", network: "spotify", tooltip: 'Spotify' },
        { url: "https://music.amazon.com/artists/B0G5GVX5KJ/fight-against-the-enemy", network: "amazon", tooltip: 'Amazon' },
        { url: "https://music.youtube.com/playlist?list=OLAK5uy_kbAD8QrgldHGBRk34wbgeMLE8aFuvC5RE", network: "youtube-music", tooltip: 'YouTube Music' },
        { url: "https://www.youtube.com/@FightAgainstTheEnemyBand", network: "youtube", tooltip: 'YouTube' },
        // { url: "https://www.shazam.com/artist/-/1857463372", network: "shazam", tooltip: 'Shazam' },
        { url: "https://www.tiktok.com/@fight_against_the_enemy", network: "tiktok", tooltip: 'TikTok' },
        { url: "https://www.instagram.com/fight_against_the_enemy", network: "instagram", tooltip: 'Instagram'},
        { url: "https://www.facebook.com/61584405977665", network: "facebook", tooltip: 'Facebook' },
        // { url: "https://soundcloud.com/", network: "soundcloud", tooltip: 'SoundCloud' },
        // { url: "https://tidal.com/", network: "tidal", tooltip: 'Tidal' },
        // { url: "https://deezer.com/", network: "deezer", tooltip: 'Deezer' },
    ],

    ALBUMS: [
        {
            id: "new-beginnings",
            title: "New Beginnings",
            year: 2025,
            description: "Planned Release TBD",
            coverSrc: new_beginnings,
            tracks: [
                {
                    title: "New Beginning",
                    audioSrc: "/audio/new-beginnings/new-beginning.mp3",
                    songImg: "",
                    storyBehindTheLyrics: "",
                    single_link_share: "https://social.tunecore.com/linkShare?linkid=QD4oNbERKt8QDIS0qlCTOQ",
                    releaseDate: "12/05/2025"
                },
                {title: "Angels", audioSrc: "/audio/new-beginnings/angels.mp3", releaseDate: ""},
                {
                    title: "Blown Away",
                    audioSrc: "/audio/new-beginnings/blown-away.mp3",
                    songImg: "",
                    storyBehindTheLyrics: "",
                    single_link_share: "https://social.tunecore.com/linkShare?linkid=ovJ1G2ylupbvjscfciA2hQ",
                    releaseDate: "12/23/2025"
                },
                {title: "Lost and Afraid", audioSrc: "/audio/new-beginnings/lost-and-afraid.mp3", releaseDate: ""},
                {title: "Tell Me", audioSrc: "/audio/new-beginnings/tell-me.mp3", releaseDate: ""},
                {title: "Running Away", audioSrc: "/audio/new-beginnings/running-away.mp3", releaseDate: ""},
                {title: "Friends", audioSrc: "/audio/new-beginnings/friends.mp3", releaseDate: ""},
                {title: "Fully Alive", audioSrc: "/audio/new-beginnings/fully-alive.mp3", releaseDate: ""},
                {title: "No More Games", audioSrc: "/audio/new-beginnings/no-more-games.mp3", releaseDate: ""},
                {
                    title: "Passion",
                    audioSrc: "/audio/new-beginnings/passion.mp3",
                    songImg: "",
                    storyBehindTheLyrics: "",
                    single_link_share: "https://social.tunecore.com/linkShare?linkid=sH2KInrt63j517J6AtNVhA",
                    releaseDate: "12/22/2025"
                },
                {title: "Hold My Hand", audioSrc: "/audio/new-beginnings/hold-my-hand.mp3", releaseDate: ""},
                {title: "Ugly", audioSrc: "/audio/new-beginnings/ugly.mp3", releaseDate: ""},
            ]
        },
        {
            id: "wake-of-determination",
            title: "Wake of Determination",
            year: 2025,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: wake_of_determination,
            tracks: [
                { title: "Brand New Day", audioSrc: "/audio/wake-of-determination/brand-new-day.mp3", releaseDate: ""  },
                { title: "Wake of Determination", audioSrc: "/audio/wake-of-determination/wake-of-determination.mp3", releaseDate: ""  },
            ],
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

