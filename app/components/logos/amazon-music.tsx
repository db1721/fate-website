export const AmazonMusicIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className={className}
    >
        <defs>
            <linearGradient id="amazonMusicGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />  {/* blue-500 */}
                <stop offset="50%" stopColor="#6366f1" /> {/* indigo-500 */}
                <stop offset="100%" stopColor="#a855f7" />{/* purple-500 */}
            </linearGradient>
        </defs>

        {/* Rounded rect background */}
        <rect
            x="32"
            y="72"
            width="448"
            height="368"
            rx="80"
            fill="url(#amazonMusicGrad)"
        />

        {/* "music" text-ish block (simplified for clarity at small sizes) */}
        <path
            fill="white"
            d="
        M 130 215
        Q 130 195 148 195
        Q 165 195 165 215
        L 165 275
        Q 165 295 148 295
        Q 130 295 130 275
        Z

        M 195 215
        Q 195 195 213 195
        Q 230 195 230 215
        L 230 275
        Q 230 295 213 295
        Q 195 295 195 275
        Z

        M 260 215
        Q 260 195 278 195
        Q 295 195 295 215
        L 295 275
        Q 295 295 278 295
        Q 260 295 260 275
        Z

        M 325 205
        Q 335 195 352 195
        Q 380 195 388 214
        Q 392 224 392 239
        L 392 275
        Q 392 295 374 295
        Q 357 295 357 275
        L 357 241
        Q 357 230 353 225
        Q 349 220 341 220
        Q 333 220 325 228
        Z
      "
        />

        {/* Amazon "smile" curve */}
        <path
            fill="none"
            stroke="#facc15"      // amber-400
            strokeWidth="10"
            strokeLinecap="round"
            d="
        M 130 335
        Q 256 380 382 335
      "
        />

        {/* Little arrow / tick at right end of smile */}
        <path
            fill="#facc15"
            d="
        M 368 322
        L 388 336
        L 372 343
        Z
      "
        />
    </svg>
);
