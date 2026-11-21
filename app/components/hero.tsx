import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { AudioTrack } from "@/app/components/audio-track";
import type { ArtistConfig, FeaturedTrack } from "@/app/config/artists/types";
import { getArtistSongPath } from "@/app/config/artists";
import { slugify } from "@/lib/utils";
import styles from "./hero.module.css";

type HeroSectionProps = {
    artist: ArtistConfig;
    featuredTrack: FeaturedTrack | null;
};

export function HeroSection({ artist, featuredTrack }: HeroSectionProps) {
    const isBuriedInRuin = artist.id === "buried-in-ruin";
    const heroImage = isBuriedInRuin
        ? featuredTrack?.coverSrc ?? artist.hero.image
        : artist.hero.image;
    const featuredPath = featuredTrack
        ? getArtistSongPath(artist, featuredTrack.songSlug ?? slugify(featuredTrack.title))
        : null;

    return (
        <section
            id="hero"
            aria-labelledby="hero-artist"
            className={`${styles.hero} ${isBuriedInRuin ? styles.ruin : styles.fate}`}
        >
            <div className={styles.stage}>
                {heroImage ? (
                    <div className={styles.visual}>
                        <Image
                            src={heroImage}
                            unoptimized={Boolean(artist.catalogStatus)}
                            alt={isBuriedInRuin
                                ? `${featuredTrack?.title ?? artist.name} cover art`
                                : `${artist.name} artist portrait`}
                            fill
                            priority
                            sizes="(min-width: 768px) 60vw, 100vw"
                            className={styles.image}
                            style={{ objectPosition: isBuriedInRuin ? "center" : "58% 32%" }}
                        />
                    </div>
                ) : null}

                <div className={styles.stageInner}>
                    <div className={styles.copy}>
                        <div className={styles.identity}>
                            <h1 id="hero-artist" className={styles.artistName}>
                                {artist.logo ? (
                                    <Image
                                        src={artist.logo}
                                        alt={artist.logoAlt}
                                        width={isBuriedInRuin ? 466 : 760}
                                        height={isBuriedInRuin ? 333 : 270}
                                        priority
                                        unoptimized={isBuriedInRuin}
                                        sizes={isBuriedInRuin
                                            ? "(min-width: 768px) 220px, 150px"
                                            : "(min-width: 768px) 460px, 260px"}
                                        className={styles.logo}
                                    />
                                ) : artist.name}
                            </h1>
                            {!isBuriedInRuin ? (
                                <p className={styles.artistFullName}>{artist.fullName}</p>
                            ) : null}
                        </div>

                        {featuredTrack ? (
                            <div className={styles.release}>
                                <h2 className={styles.trackTitle}>{featuredTrack.title}</h2>
                                {featuredTrack.subtitle ? (
                                    <p className={styles.releaseSubtitle}>{featuredTrack.subtitle}</p>
                                ) : null}
                                {featuredTrack.description ? (
                                    <p className={styles.description}>{featuredTrack.description}</p>
                                ) : null}
                            </div>
                        ) : (
                            <div className={styles.release}>
                                <h2 className={styles.trackTitle}>{artist.hero.noFeatureTitle}</h2>
                                <p className={styles.description}>{artist.hero.noFeatureDescription}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.rail}>
                <div className={`${styles.railInner} ${!featuredTrack ? styles.railEmpty : ""}`}>
                    {featuredTrack && featuredPath ? (
                        <AudioTrack
                            key={`${artist.id}-${featuredTrack.songSlug ?? featuredTrack.title}`}
                            id={`${featuredTrack.title}-feature`}
                            trackTitle={featuredTrack.title}
                            src={featuredTrack.audioSrc}
                            previewStartTime={featuredTrack.previewStartTime}
                            projectId={artist.id}
                            appearance="hero"
                        />
                    ) : null}

                    <nav aria-label="Explore music" className={styles.links}>
                        {featuredPath ? (
                            <Link href={featuredPath} className={styles.link}>
                                Lyrics &amp; streaming
                                <ArrowUpRight size={16} aria-hidden="true" />
                            </Link>
                        ) : null}
                        <a href="#albums" className={styles.link}>
                            {artist.hero.secondaryCta}
                            <ArrowDown size={16} aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </div>
        </section>
    );
}
