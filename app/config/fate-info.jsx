import e2 from './../assets/evolve_and_elevate_120.png';
import new_beginnings from './../assets/albums/new-beginnings-cover.png';
import new_beginning from './../assets/albums/new-beginning-cover.png';
import blown_away_single from './../assets/albums/blown-away-cover.png';
import running_away_single from './../assets/albums/running-away-cover.png';
import tell_me_single from './../assets/albums/tell-me-cover.jpg';
import angels from './../assets/albums/angels-single-cover.jpg';
import ugly from './../assets/albums/ugly-single-cover.png';
import friends from './../assets/albums/friends-single-cover.jpg';
import passion_single from './../assets/albums/passion-single-cover.png';
import wake_of_determination from './../assets/albums/wake-of-determination.png';
import music_for_all from './../assets/blogs/music-for-all-logo-site.png';
import roadie_music from './../assets/blogs/roadie-music.jpg';

const bandInfo = {
    band_logo: e2,
    band_name: 'F.A.T.E',
    band_name_full: 'Fight Against the Enemy',
    band_description: 'Modern melodic rock with heavy guitars, emotional lyrics, and anthemic hooks. New Beginnings arrives May 8, 2026.',
    band_seo_description: 'F.A.T.E. (Fight Against the Enemy) is a modern melodic rock project creating heavy, emotional songs for listeners who connect with resilience, struggle, and hope. The New Beginnings album arrives May 8, 2026.',

    FEATURED_TRACK: {
        title: "Friends",
        subtitle: "Featured Single from New Beginnings",
        coverSrc: friends,
        audioSrc: "/audio/new-beginnings/friends-feature.mp3",
    },

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
            releaseDate: "05/08/2026",
            tagline: "The debut album from F.A.T.E.",
            highlightTrack: "Friends",
            description: "New Beginnings is the first full chapter from F.A.T.E.: twelve heavy melodic rock tracks about loyalty, scars, resilience, and choosing to keep fighting when the easy thing would be to shut down.",
            coverSrc: new_beginnings,
            tracks: [
                {
                    title: "New Beginning",
                    audioSrc: "/audio/new-beginnings/new-beginning.mp3",
                    songImg: new_beginning,
                    storyBehindTheLyrics: "",
                    lyricsFile: "/lyrics/new-beginnings/new-beginning.txt",
                    previewStartTime: 38,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/album/1iiUdWw0JICReZ4FJ7ey93", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/new-beginning-single/1859188495?app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/albums/B0G5GW3F9N?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/playlist?list=OLAK5uy_kbAD8QrgldHGBRk34wbgeMLE8aFuvC5RE", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fnew-beginning%2FALgrmkclwJd5ZPw&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A57501905&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A57501905&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/album/479414350", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/album/871797142", network: "deezer", tooltip: 'Deezer' },
                    ],
                    releaseDate: "12/05/2025"
                },
                {
                    title: "Angels",
                    audioSrc: "/audio/new-beginnings/angels.mp3",
                    songImg: angels,
                    storyBehindTheLyrics: "",
                    lyricsFile: "/lyrics/new-beginnings/angels.txt",
                    previewStartTime: 95,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/album/40VNaQq6OQysEgypm0KFyR", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/angels-single/1881379494?app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/albums/B0GQHHX6RR?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=j4WYi3ZYMHE", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fangels%2FALcd3cP2vKpkrXm&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A62489408&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A62489408&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/album/502818596", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/album/928701881", network: "deezer", tooltip: 'Deezer' },
                    ],
                    releaseDate: "3/15/2026"
                },
                {
                    title: "Blown Away",
                    audioSrc: "/audio/new-beginnings/blown-away.mp3",
                    songImg: blown_away_single,
                    lyricsFile: "/lyrics/new-beginnings/blown-away.txt",
                    storyBehindTheLyrics: "",
                    previewStartTime: 205,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/59cTj9qqaHxLPChsO8wyAY?si=z6olPIt6RFiZeIXZAMApJw", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/blown-away/1862505682?i=1862505690&app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0G8G4XND6/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=3kyoxZt08hE", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fblown-away%2Fblown-away%2FTRv2h36nJx3xjZk&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A185075546&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A185075546&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/track/482906101", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3724405252", network: "deezer", tooltip: 'Deezer' },
                    ],
                    releaseDate: "12/23/2025"
                },
                {
                    title: "Lost and Afraid",
                    audioSrc: "/audio/new-beginnings/lost-and-afraid.mp3",
                    lyricsFile: "/lyrics/new-beginnings/lost-and-afraid.txt",
                    previewStartTime: 50,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/6PAleRr6Z7Sq30TcEtyEO2", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/lost-and-afraid/1889441855?i=1889441860&app=itunes&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0GVG8KTK1/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://www.youtube.com/watch?v=j4WYi3ZYMHE", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fnew-beginnings%2Flost-and-afraid%2FTRZjlx4nxxbwdlm&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827299&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827299&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/track/511351072", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3929916391", network: "deezer", tooltip: 'Deezer' },
                    ],
                },
                {
                    title: "Tell Me",
                    audioSrc: "/audio/new-beginnings/tell-me.mp3",
                    songImg: tell_me_single,
                    storyBehindTheLyrics: "",
                    lyricsFile: "/lyrics/new-beginnings/tell-me.txt",
                    previewStartTime: 57,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/album/5E2Bf41np3bT61B8V394Mu", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/tell-me-single/1875872747?app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/albums/B0GMH9X6P8?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/playlist?list=OLAK5uy_luuBBzTbOeEu-pNUHGbbryzwjrtc1Q-4A", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Ftell-me%2FALnZthXkmzxXjw4&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A61845926&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A61845926&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/album/497415206", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/album/914897531", network: "deezer", tooltip: 'Deezer' },
                    ],
                    releaseDate: "02/28/2026"
                },
                {
                    title: "Running Away",
                    audioSrc: "/audio/new-beginnings/running-away.mp3",
                    songImg: running_away_single,
                    storyBehindTheLyrics: "",
                    lyricsFile: "/lyrics/new-beginnings/running-away.txt",
                    previewStartTime: 0,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/album/5qFoeXT3zlMMUTlscoES75", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/running-away-single/1870796810?app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/albums/B0GHXYFJVB?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/playlist?list=OLAK5uy_my2trYHRQGcxWCunqldOxubPKaEA0JEqA", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Frunning-away%2FALXgfm5j3gh7lzZ&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A60038930&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A60038930&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/album/491371880", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/album/901807612", network: "deezer", tooltip: 'Deezer' },
                    ],
                    releaseDate: "02/16/2026"
                },
                {
                    title: "Friends",
                    audioSrc: "/audio/new-beginnings/friends.mp3",
                    previewSrc: "/audio/new-beginnings/friends-feature.mp3",
                    songImg: friends,
                    storyBehindTheLyrics: "",
                    previewStartTime: 113,
                    previewStartLabel: "Featured preview",
                    lyricsFile: "/lyrics/new-beginnings/friends.txt",
                    featured: true,
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/0BDNmxnU0FRDkqt5Q7PNVm", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/friends/1889441855?i=1889441863&app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0GVGDDPXZ/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=ixcUpL_7TSM", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fnew-beginnings%2Ffriends%2FTR292n5Kq6jcpvV&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827302&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827302&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/track/511351075", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3929916421", network: "deezer", tooltip: 'Deezer' },
                    ]
                },
                {
                    title: "Fully Alive",
                    audioSrc: "/audio/new-beginnings/fully-alive.mp3",
                    lyricsFile: "/lyrics/new-beginnings/fully-alive.txt",
                    previewStartTime: 147,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/59rp0niuIrYW4zW43yGRpp", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/fully-alive/1889441855?i=1889441864&app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0GVGFD8SY/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=Q0WA4AsshFs", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fnew-beginnings%2Ffully-alive%2FTRfppVqZJKmKnfX&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827303&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827303&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/track/511351076", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3929916431", network: "deezer", tooltip: 'Deezer' },
                    ]
                },
                {
                    title: "No More Games",
                    audioSrc: "/audio/new-beginnings/no-more-games.mp3",
                    lyricsFile: "/lyrics/new-beginnings/no-more-games.txt",
                    previewStartTime: 50,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/4gCsaPlT6b067JAabHeQEj", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/no-more-games/1889441855?i=1889441865&app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0GVGR3CSP/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=RHcpXJeXnog", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fnew-beginnings%2Fno-more-games%2FTRrK4Jwg3V96Zbq&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827304&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827304&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/track/511351077", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3929916441", network: "deezer", tooltip: 'Deezer' },
                    ]
                },
                {
                    title: "Passion",
                    audioSrc: "/audio/new-beginnings/passion.mp3",
                    songImg: passion_single,
                    lyricsFile: "/lyrics/new-beginnings/passion.txt",
                    storyBehindTheLyrics: "",
                    previewStartTime: 98,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/album/0pFHCochD1qBw28hkHdkhn", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/passion-single/1862032529?app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/albums/B0G75QHN7D?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/playlist?list=OLAK5uy_km9ctJAPlUcId71J56P0-8X4ijIopFkGk", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fpassion%2FALZ342chP47gwJq&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A58032336&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Falbum%3Ftoken%3DAL%3A58032336&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/album/482011027", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/album/878037432", network: "deezer", tooltip: 'Deezer' },
                    ],
                    releaseDate: "12/22/2025"
                },
                {
                    title: "Hold My Hand",
                    audioSrc: "/audio/new-beginnings/hold-my-hand.mp3",
                    lyricsFile: "/lyrics/new-beginnings/hold-my-hand.txt",
                    previewStartTime: 125,
                    previewStartLabel: "Chorus preview",
                    songServiceLinks: [
                        { url: "https://open.spotify.com/track/2Zu5sQcNRbZmRbcmOHNhu8", network: "spotify", tooltip: 'Spotify' },
                        { url: "https://geo.music.apple.com/us/album/hold-my-hand/1889441855?i=1889441867&app=music&ls=1", network: "apple", tooltip: 'Apple' },
                        { url: "https://music.amazon.com/tracks/B0GVGD69CR/?ref=dm_ff_amazonmusic_3p", network: "amazon", tooltip: 'Amazon' },
                        { url: "https://music.youtube.com/watch?v=H-i9VD3zyqI", network: "youtube-music", tooltip: 'YouTube Music' },
                        { url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Ffight-against-the-enemy%2Fnew-beginnings%2Fhold-my-hand%2FTRd3qmkkkVqPJrX&$ios_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827306&$android_deeplink_path=pandorav4%3A%2F%2Fbackstage%2Ftrack%3Ftoken%3DTR%3A199827306&~channel=Partner%20Catalog%20Search%20API", network: "pandora", tooltip: 'Pandora' },
                        { url: "http://www.tidal.com/track/511351079", network: "tidal", tooltip: 'Tidal' },
                        { url: "https://www.deezer.com/track/3929916461", network: "deezer", tooltip: 'Deezer' },
                    ]
                },
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
                    releaseDate: "3/29/2026"
                },
            ]
        },
        {
            id: "wake-of-determination",
            title: "Wake of Determination",
            year: 2026,
            description: "A darker chapter built around emotional riffs, pressure, release, and determination.",
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

