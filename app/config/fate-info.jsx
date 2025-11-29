import e2 from './../assets/evolve_and_elevate_120.png';
import new_beginnings from './../assets/albums/new-beginnings-cover.png';
import wake_of_determination from './../assets/albums/wake-of-determination.png';

const bandInfo = {
    band_logo: e2,
    band_name: 'F.A.T.E',
    band_name_full: 'Fight Against the Enemy',
    band_description: 'logo',
    band_seo_description: 'logo',

    ALBUMS: [
        {
            id: "new-beginnings",
            title: "New Beginnings",
            year: 2025,
            description: "Heavy, melodic metalcore with big choruses.",
            coverSrc: new_beginnings,
            tracks: [
                {title: "New Beginning", audioSrc: "/audio/new-beginning.mp3", releaseDate: "11/20/2025"},
                {title: "Angels", audioSrc: "/audio/barbie.mp3", releaseDate: "1/23/2026"},
                {title: "Blown Away", audioSrc: "/audio/chase-your-dreams.mp3", releaseDate: "1/2/2026"},
                {title: "Lost and Afraid", audioSrc: "/audio/new-beginning.mp3", releaseDate: ""},
                {title: "Tell Me", audioSrc: "/audio/barbie.mp3", releaseDate: "1/2/2026"},
                {title: "Running Away", audioSrc: "/audio/chase-your-dreams.mp3", releaseDate: ""},
                {title: "Friends", audioSrc: "/audio/new-beginning.mp3", releaseDate: "1/23/2026"},
                {title: "Fully Alive", audioSrc: "/audio/barbie.mp3", releaseDate: ""},
                {title: "No More Games", audioSrc: "/audio/chase-your-dreams.mp3", releaseDate: ""},
                {title: "Passion", audioSrc: "/audio/new-beginning.mp3", releaseDate: ""},
                {title: "Hold My Hand", audioSrc: "/audio/barbie.mp3", releaseDate: "1/2/2026"},
                {title: "Ugly", audioSrc: "/audio/barbie.mp3", releaseDate: "1/23/2026"},
            ]
        },
        {
            id: "wake-of-determination",
            title: "Wake of Determination",
            year: 2025,
            description: "Dark, emotional riffs and breakdowns.",
            coverSrc: wake_of_determination,
            tracks: [
                { title: "Had It All", audioSrc: "/audio/had-it-all.mp3", releaseDate: ""  },
                { title: "Losing My Grip", audioSrc: "/audio/losing-my-grip.mp3", releaseDate: ""  },
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

