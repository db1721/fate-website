export const AppleMusicIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className={className}
    >
        <defs>
            <linearGradient id="appleMusicGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5f8a" />
                <stop offset="50%" stopColor="#ff3f5f" />
                <stop offset="100%" stopColor="#c650ff" />
            </linearGradient>
        </defs>

        {/* Circle background */}
        <circle cx="256" cy="256" r="256" fill="url(#appleMusicGrad)" />

        {/* Thicker music note */}
        <path
            fill="white"
            d="
        M 340 140
        L 210 165
        Q 190 170 190 190
        L 190 330
        Q 170 315 145 320
        Q 115 325 105 355
        Q 95 385 115 405
        Q 135 425 165 415
        Q 195 405 205 375
        L 205 225
        L 325 200
        L 325 320
        Q 305 305 280 310
        Q 250 315 240 345
        Q 230 375 250 395
        Q 270 415 300 405
        Q 330 395 340 365
        Z
      "
        />
    </svg>
);
