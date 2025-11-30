'use client';

import {
    createContext,
    useContext,
    useRef,
    useCallback,
    ReactNode,
} from 'react';

type AudioManagerContextType = {
    registerAudio: (id: string, el: HTMLAudioElement | null) => void;
    handlePlay: (id: string) => void;
};

const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

export function AudioManagerProvider({ children }: { children: ReactNode }) {
    // Keep references to all audio elements by id
    const audioMapRef = useRef<Record<string, HTMLAudioElement | null>>({});
    const currentIdRef = useRef<string | null>(null);

    const registerAudio = useCallback((id: string, el: HTMLAudioElement | null) => {
        audioMapRef.current[id] = el;
    }, []);

    const handlePlay = useCallback((id: string) => {
        const currentId = currentIdRef.current;

        // If another track is playing, pause + reset it
        if (currentId && currentId !== id) {
            const previousAudio = audioMapRef.current[currentId];
            if (previousAudio && !previousAudio.paused) {
                previousAudio.pause();
                previousAudio.currentTime = 0;
            }
        }

        currentIdRef.current = id;
    }, []);

    return (
        <AudioManagerContext.Provider value={{ registerAudio, handlePlay }}>
            {children}
        </AudioManagerContext.Provider>
    );
}

export function useAudioManager() {
    const ctx = useContext(AudioManagerContext);
    if (!ctx) {
        throw new Error('useAudioManager must be used within AudioManagerProvider');
    }
    return ctx;
}
