import e2 from './../assets/evolve_and_elevate_120.png';
import music_for_all from './../assets/blogs/music-for-all-logo-site.png';
import roadie_music from './../assets/blogs/roadie-music.jpg';

const bandInfo = {
    band_logo: e2,
    band_name: 'F.A.T.E',
    band_name_full: 'Fight Against the Enemy',
    band_description: 'Modern melodic rock with heavy guitars, emotional lyrics, and anthemic hooks.',
    band_seo_description: 'F.A.T.E. (Fight Against the Enemy) is a modern melodic rock project creating heavy, emotional songs for listeners who connect with resilience, struggle, and hope.',

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
        { url: "https://www.iheart.com/artist/fight-against-the-enemy-50213671", network: "iheart", tooltip: 'iHeart' },
        // { url: "https://www.shazam.com/artist/-/1857463372", network: "shazam", tooltip: 'Shazam' },
        { url: "https://www.youtube.com/@FightAgainstTheEnemyMusic", network: "youtube", tooltip: 'YouTube' },
        { url: "https://www.tiktok.com/@fight_against_the_enemy", network: "tiktok", tooltip: 'TikTok' },
        { url: "https://www.instagram.com/fight_against_the_enemy", network: "instagram", tooltip: 'Instagram'},
        { url: "https://www.facebook.com/61584405977665", network: "facebook", tooltip: 'Facebook' },
        { url: "https://x.com/F_A_T_E_music", network: "x", tooltip: 'X' },
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

