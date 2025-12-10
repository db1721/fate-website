import e2 from './../assets/evolve_and_elevate_120.png';
import new_beginnings from './../assets/albums/new-beginnings-cover.png';
import new_beginning from './../assets/albums/new-beginning-cover.png';
import wake_of_determination from './../assets/albums/wake-of-determination.png';

const bandInfo = {
    band_logo: e2,
    band_name: 'F.A.T.E',
    band_name_full: 'Fight Against the Enemy',
    band_description: 'logo',
    band_seo_description: 'logo',

    FEATURED_TRACK: {
        title: "New Beginning",
        subtitle: "Featured Single",
        coverSrc: new_beginning,
        audioSrc: "/audio/new-beginnings/new-beginning-feature.mp3",
        link: "https://social.tunecore.com/linkShare?linkid=QD4oNbERKt8QDIS0qlCTOQ",
    },

    MAIN_BAND_PAGE: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL",
    SOCIAL_LINKS: [
        { url: "https://music.apple.com/us/artist/fight-against-the-enemy/1857463372", network: "apple", tooltip: 'Apple' },
        { url: "https://open.spotify.com/artist/5ANd03MPu8A0eOoeRzK8JL", network: "spotify", tooltip: 'Spotify' },
        { url: "https://music.amazon.com/artists/B0G5GVX5KJ/fight-against-the-enemy", network: "amazon", tooltip: 'Amazon' },
        { url: "https://music.youtube.com/playlist?list=OLAK5uy_kbAD8QrgldHGBRk34wbgeMLE8aFuvC5RE", network: "youtube-music", tooltip: 'YouTube Music' },
        { url: "https://www.youtube.com/@FightAgainstTheEnemyBand", network: "youtube", tooltip: 'YouTube' },
        { url: "https://www.shazam.com/artist/-/1857463372", network: "shazam", tooltip: 'Shazam' },
        { url: "https://www.tiktok.com/@fight_against_the_enemy", network: "tiktok", tooltip: 'TikTok' },
        { url: "https://www.instagram.com/fight_against_the_enemy", network: "instagram", tooltip: 'Instagram'},
        { url: "https://www.facebook.com/profile.php?id=61584405977665", network: "facebook", tooltip: 'Facebook' },
        // { url: "https://soundcloud.com/", network: "soundcloud", tooltip: 'SoundCloud' },
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
                    releaseDate: "12/05/2025"
                },
                {title: "Angels", audioSrc: "/audio/new-beginnings/angels.mp3", releaseDate: ""},
                {title: "Blown Away", audioSrc: "/audio/new-beginnings/blown-away.mp3", releaseDate: ""},
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

    // Header
    header_logo_image_alt_text: "Round logo",
    header_text: <p>Wdd</p>,

    // Why Us
    why_us_text: [
        {
            key: 0,
            title: "Licensed Contractors",
            description: "As a company dedicated to providing premier customer service, it is important to us to deliver unparalleled workmanship on every assignment.​ We are accredited, licensed, bonded, and insured. With our experience and expertise, we can provide the support your project needs.",
        },
        {
            key: 1,
            title: "On-Time Completion",
            description: "We will work with you to meet deadlines and coordinate with other related projects. We will maintain open communication with you to keep you up to date on the status of your job. We do this to guarantee that the project is completed according to your preferences.",
        },
        {
            key: 2,
            title: "Great Service",
            description: "We combine our industry knowledge, the highest quality building supplies and equipment, and our dedication to deliver exceptional service to our clients. We will stay in touch, keeping you up to date on both the paperwork and renovation process.",
        },
    ],

    // Testimonials
    testimonials: [
        {
            title: 'Kitchen Remodel',
            testimonial: '"Prestige actually had my kitchen done in two weeks!"',
            author:"Dan B.",
            location:"Hampstead",
            company_logo: e2,
            company_logo_alt:"Evolve and Elevate's logo",
            company_link: "https://www.evolveelevatemedia.com/",
        },
        {
            title: 'Wow!',
            testimonial: '"Excellent work and friendly!"',
            author:"Bob C.",
            location:"Woodlawn",
            company_logo: "",
            company_logo_alt_text:"",
            company_link: "",
        },
        {
            title: 'Highly Recommend',
            testimonial: '"For house flipping use no other contractor!"',
            author:"Robin and Joe",
            location:"Baltimore",
            company_logo: "",
            company_logo_alt_text:"",
            company_link: "",
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

