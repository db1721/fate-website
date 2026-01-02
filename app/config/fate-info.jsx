import e2 from './../assets/evolve_and_elevate_120.png';
import new_beginnings from './../assets/albums/new-beginnings-cover.png';
import new_beginning from './../assets/albums/new-beginning-cover.png';
import blown_away_single from './../assets/albums/blown-away-cover.png';
import passion_single from './../assets/albums/passion-single-cover.png';
import wake_of_determination from './../assets/albums/wake-of-determination.png';
import monster_you_created from './../assets/albums/silent-chaos-moster-you-created.png';
import collapse_rebuild from './../assets/albums/collapse-rebuild-cover.png';
import you_deserve_better from './../assets/albums/you-deserve-better-cover.png';
import addicted_to_the_pain from './../assets/albums/addicted-to-the-pain-cover.png';
import kill_count_chron from './../assets/albums/eye-in-forest.jpeg';

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
        audioSrc: "/audio/blown-away-feature.mp3",
        link: "https://social.tunecore.com/linkShare?linkid=ovJ1G2ylupbvjscfciA2hQ",
    },

    MAIN_BAND_PAGE: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL",
    SOCIAL_LINKS: [
        { url: "https://music.apple.com/us/artist/fight-against-the-enemy/1857463372", network: "apple", tooltip: 'Apple' },
        { url: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL", network: "spotify", tooltip: 'Spotify' },
        { url: "https://music.amazon.com/artists/B0G5GVX5KJ/fight-against-the-enemy", network: "amazon", tooltip: 'Amazon' },
        { url: "https://music.youtube.com/channel/UCiJwczqQ64-8z2rNQZ3ejdA", network: "youtube-music", tooltip: 'YouTube Music' },
        { url: "https://www.pandora.com/artist/fight-against-the-enemy/ARcjJrbl6cx5gnc", network: "pandora", tooltip: 'Pandora' },
        // { url: "https://soundcloud.com/", network: "soundcloud", tooltip: 'SoundCloud' },
        { url: "https://tidal.com/artist/70888371", network: "tidal", tooltip: 'Tidal' },
        { url: "https://www.deezer.com/us/artist/360343182", network: "deezer", tooltip: 'Deezer' },
        // { url: "https://www.shazam.com/artist/-/1857463372", network: "shazam", tooltip: 'Shazam' },
        { url: "https://www.youtube.com/@FightAgainstTheEnemyBand", network: "youtube", tooltip: 'YouTube' },
        { url: "https://www.tiktok.com/@fight_against_the_enemy", network: "tiktok", tooltip: 'TikTok' },
        { url: "https://www.instagram.com/fight_against_the_enemy", network: "instagram", tooltip: 'Instagram'},
        { url: "https://www.facebook.com/61584405977665", network: "facebook", tooltip: 'Facebook' },
        // { url: "https://x.com/F_A_T_E_music", network: "x", tooltip: 'X' },
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
                    audioSrc: "/audio/new-beginning.mp3",
                    songImg: "",
                    storyBehindTheLyrics: "",
                    single_link_share: "https://social.tunecore.com/linkShare?linkid=QD4oNbERKt8QDIS0qlCTOQ",
                    releaseDate: "12/05/2025"
                },
                {title: "Angels", audioSrc: "/audio/angels.mp3", releaseDate: ""},
                {
                    title: "Blown Away",
                    audioSrc: "/audio/blown-away.mp3",
                    songImg: "",
                    storyBehindTheLyrics: "",
                    single_link_share: "https://social.tunecore.com/linkShare?linkid=ovJ1G2ylupbvjscfciA2hQ",
                    releaseDate: "12/23/2025"
                },
                {title: "Lost and Afraid", audioSrc: "/audio/lost-and-afraid.mp3", releaseDate: ""},
                {title: "Tell Me", audioSrc: "/audio/tell-me.mp3", releaseDate: ""},
                {title: "Running Away", audioSrc: "/audio/running-away.mp3", releaseDate: ""},
                {title: "Friends", audioSrc: "/audio/friends.mp3", releaseDate: ""},
                {title: "Fully Alive", audioSrc: "/audio/fully-alive.mp3", releaseDate: ""},
                {title: "No More Games", audioSrc: "/audio/no-more-games.mp3", releaseDate: ""},
                {
                    title: "Passion",
                    audioSrc: "/audio/passion.mp3",
                    songImg: "",
                    storyBehindTheLyrics: "",
                    single_link_share: "https://social.tunecore.com/linkShare?linkid=sH2KInrt63j517J6AtNVhA",
                    releaseDate: "12/22/2025"
                },
                {title: "Hold My Hand", audioSrc: "/audio/hold-my-hand.mp3", releaseDate: ""},
                {title: "Ugly", audioSrc: "/audio/ugly.mp3", releaseDate: ""},
            ]
        },
        {
            id: "monster-you-created",
            title: "Monster You Created",
            year: 2025,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: monster_you_created,
            tracks: [
                { title: "Created A Monster", audioSrc: "/audio/brand-new-day.mp3", releaseDate: ""  },
            ],
        },
        {
            id: "wake-of-determination",
            title: "Wake of Determination",
            year: 2026,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: wake_of_determination,
            tracks: [
                { title: "Brand New Day", audioSrc: "/audio/brand-new-day.mp3", releaseDate: ""  },
                // { title: "Wake of Determination", audioSrc: "/audio.mp3", releaseDate: ""  },
            ],
        },
        {
            id: "collapse_rebuild",
            title: "Collapse // Rebuild",
            year: 2025,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: collapse_rebuild,
            tracks: [
                { title: "Collapse", audioSrc: "/audio/collapse.mp3", releaseDate: ""  },
                { title: "Get Away From Me", audioSrc: "/audio/get-away-from-me.mp3", releaseDate: ""  },
                { title: "Get Out of My Head", audioSrc: "/audio/get-out-of-my-head.mp3", releaseDate: ""  },
                { title: "Give It All", audioSrc: "/audio/give-it-all.mp3", releaseDate: ""  },
                { title: "Help Me", audioSrc: "/audio/help-me.mp3", releaseDate: ""  },
                { title: "Influencing", audioSrc: "/audio/influencing.mp3", releaseDate: ""  },
                { title: "Shut Me Out", audioSrc: "/audio/shut-me-out.mp3", releaseDate: ""  },
                { title: "So What", audioSrc: "/audio/so-what.mp3", releaseDate: ""  },
                { title: "We Are", audioSrc: "/audio/we-are.mp3", releaseDate: ""  },
            ],
        },
        {
            id: "addicted_to_the_pain",
            title: "Addicted to the Pain",
            year: 2026,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: addicted_to_the_pain,
            tracks: [
                { title: "Addicted to the Pain", audioSrc: "/audio/addicted-to-the-pain.mp3", releaseDate: ""  },
                { title: "Breathless", audioSrc: "/audio/breathless.mp3", releaseDate: ""  },
                { title: "I Swear", audioSrc: "/audio/i-swear.mp3", releaseDate: ""  },
                { title: "Setting Myself Free", audioSrc: "/audio/setting-myself-free.mp3", releaseDate: ""  },
            ],
        },
        {
            id: "you_deserve_better",
            title: "You Deserve Better",
            year: 2027,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: you_deserve_better,
            tracks: [
                { title: "Afraid", audioSrc: "/audio/afraid.mp3", releaseDate: ""  },
            ],
        },
        {
            id: "kill_count_chron",
            title: "Kill Count Chronicles",
            year: 2027,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: kill_count_chron,
            tracks: [
                { title: "Eat You Alive", audioSrc: "/audio/eat-you-alive.mp3", releaseDate: ""  },
                { title: "Duality of Identity", audioSrc: "/audio/duality-of-identity.mp3", releaseDate: ""  },
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

