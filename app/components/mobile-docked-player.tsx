"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Pause, Play, X } from "lucide-react";
import type { ImageSource } from "@/app/config/artists/types";
import { formatAudioTime } from "@/lib/audio-preview";
import styles from "./mobile-docked-player.module.css";

type MobileDockedPlayerProps = {
    trackTitle: string;
    artistName: string;
    coverSrc: ImageSource;
    playing: boolean;
    currentTime: number;
    duration: number;
    onToggle: () => void;
    onSeek: (seconds: number) => void;
    onClose: () => void;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    error?: string | null;
};

export function MobileDockedPlayer({
    trackTitle, artistName, coverSrc, playing, currentTime, duration,
    onToggle, onSeek, onClose, expanded, onExpandedChange, error,
}: MobileDockedPlayerProps) {
    const dockRef = useRef<HTMLElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const expandRef = useRef<HTMLButtonElement>(null);
    const dialogId = useId();
    const hasDuration = Number.isFinite(duration) && duration > 0;
    const elapsed = Math.max(0, Math.min(Number.isFinite(currentTime) ? currentTime : 0, hasDuration ? duration : 0));

    useEffect(() => {
        const dock = dockRef.current;
        if (!dock) return;
        const pageStyle = document.documentElement.style;
        const updateHeight = () => {
            pageStyle.setProperty("--mobile-player-dock-height", `${Math.ceil(dock.getBoundingClientRect().height)}px`);
        };
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(dock);
        return () => {
            observer.disconnect();
            pageStyle.removeProperty("--mobile-player-dock-height");
        };
    }, []);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (expanded && !dialog.open) {
            dialog.showModal();
        } else if (!expanded && dialog.open) {
            dialog.close();
            expandRef.current?.focus({ preventScroll: true });
        }
    }, [expanded]);

    const playButton = (
        <button
            className={styles.play}
            type="button"
            onClick={onToggle}
            aria-label={`${playing ? "Pause" : "Play"} ${trackTitle}`}
        >
            {playing ? <Pause fill="currentColor" aria-hidden="true" /> : <Play fill="currentColor" aria-hidden="true" />}
        </button>
    );

    const transport = (
        <div>
            <input
                aria-label={`Seek ${trackTitle}`}
                aria-valuetext={hasDuration ? `${formatAudioTime(elapsed)} of ${formatAudioTime(duration)}` : undefined}
                className={styles.seek}
                type="range"
                min={0}
                max={hasDuration ? duration : 0}
                step={0.1}
                value={elapsed}
                disabled={!hasDuration}
                onChange={(event) => onSeek(event.currentTarget.valueAsNumber)}
                style={{ "--played": `${hasDuration ? elapsed / duration * 100 : 0}%` } as CSSProperties}
            />
            <div className={styles.times} aria-hidden="true">
                <span>{formatAudioTime(elapsed)}</span>
                <span>Preview {hasDuration ? formatAudioTime(duration) : "—"}</span>
            </div>
        </div>
    );

    const trackInfo = (
        <>
            <Image src={coverSrc} alt="" width={42} height={42} unoptimized className={styles.thumbnail} />
            <span className={styles.info}>
                <strong>{trackTitle}</strong>
                <span>{artistName}</span>
            </span>
        </>
    );

    return (
        <>
            <aside ref={dockRef} className={styles.dock} aria-label="Song preview player">
                <div className={styles.summary}>
                    <button
                        ref={expandRef}
                        type="button"
                        className={styles.expand}
                        aria-label={`Expand player for ${trackTitle}`}
                        aria-expanded={expanded}
                        aria-controls={dialogId}
                        aria-haspopup="dialog"
                        onClick={() => onExpandedChange(true)}
                    >
                        {trackInfo}
                        <ChevronUp aria-hidden="true" />
                    </button>
                    {playButton}
                </div>
                {transport}
                {error && !expanded && <p className={styles.error} role="status">{error}</p>}
            </aside>

            <dialog
                ref={dialogRef}
                id={dialogId}
                className={styles.dialog}
                aria-label={`${trackTitle} preview player`}
                onCancel={(event) => {
                    event.preventDefault();
                    onExpandedChange(false);
                }}
            >
                {expanded && <>
                    <div className={styles.summary}>
                        <button
                            type="button"
                            className={styles.expand}
                            aria-label="Collapse player"
                            onClick={() => onExpandedChange(false)}
                        >
                            {trackInfo}
                            <ChevronDown aria-hidden="true" />
                        </button>
                        {playButton}
                    </div>
                    <div className={styles.cover}>
                        <Image src={coverSrc} alt={`Cover art for ${trackTitle}`} width={600} height={600} unoptimized />
                    </div>
                    <div>
                        {transport}
                        {error && <p className={styles.error} role="status">{error}</p>}
                        <button
                            type="button"
                            className={styles.dismiss}
                            onClick={() => {
                                dialogRef.current?.close();
                                onClose();
                            }}
                        >
                            <X aria-hidden="true" /> Dismiss player
                        </button>
                    </div>
                </>}
            </dialog>
        </>
    );
}
