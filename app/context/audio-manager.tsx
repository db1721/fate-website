'use client';

import {
    createContext,
    useContext,
    useRef,
    useCallback,
    useMemo,
    ReactNode,
} from 'react';

type AudioManagerContextType = {
    registerAudio: (el: HTMLAudioElement) => () => void;
};

const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

export function AudioManagerProvider({ children }: { children: ReactNode }) {
    const audioElementsRef = useRef(new Set<HTMLAudioElement>());

    const registerAudio = useCallback((el: HTMLAudioElement) => {
        const elements = audioElementsRef.current;
        elements.add(el);

        const handlePlay = () => {
            // A queued play event may arrive after this player was already paused.
            if (el.paused) return;

            for (const other of elements) {
                if (other !== el && !other.paused) other.pause();
            }
        };

        el.addEventListener('play', handlePlay);
        handlePlay();

        return () => {
            el.removeEventListener('play', handlePlay);
            elements.delete(el);
            el.pause();
        };
    }, []);

    const value = useMemo(() => ({ registerAudio }), [registerAudio]);

    return (
        <AudioManagerContext.Provider value={value}>
            {children}
        </AudioManagerContext.Provider>
    );
}

export function useAudioManager() {
    const ctx = useContext(AudioManagerContext);

    if (!ctx) throw new Error('useAudioManager must be used within AudioManagerProvider');
    return ctx;
}
