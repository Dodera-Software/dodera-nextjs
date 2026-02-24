/**
 * Custom n8n logo icon component
 * Exact recreation of the n8n connected nodes logo
 */

interface N8nIconProps {
    className?: string;
}

export function N8nIcon({ className = "size-6" }: N8nIconProps) {
    return (
        <svg
            viewBox="0 0 100 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="12" cy="45" r="7" stroke="currentColor" strokeWidth="5" fill="none" />
            <line x1="19" y1="45" x2="34" y2="45" stroke="currentColor" strokeWidth="5" />
            <circle cx="42" cy="45" r="8" stroke="currentColor" strokeWidth="5" fill="none" />
            <path
                d="M 50 42 C 58 38, 60 22, 72 18"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M 50 48 C 58 52, 60 58, 68 58"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />
            <circle cx="82" cy="15" r="10" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle cx="78" cy="58" r="8" stroke="currentColor" strokeWidth="5" fill="none" />
        </svg>
    );
}
