"use client";

import type { OrigamiFigure } from "@/types";

interface OrigamiIconProps {
  figure: OrigamiFigure;
  color?: string;
  size?: number;
  className?: string;
}

// Simple origami-style SVG paths for each figure
const FIGURE_PATHS: Record<OrigamiFigure, React.ReactNode> = {
  fuchs: (
    <g>
      <polygon points="12,2 2,18 22,18" fill="currentColor" opacity="0.9" />
      <polygon points="12,6 6,18 18,18" fill="currentColor" opacity="0.7" />
      <circle cx="9" cy="13" r="1" fill="white" />
      <circle cx="15" cy="13" r="1" fill="white" />
      <polygon points="12,14 11,16 13,16" fill="white" opacity="0.8" />
    </g>
  ),
  boot: (
    <g>
      <polygon points="12,4 4,14 20,14" fill="currentColor" opacity="0.9" />
      <polygon points="3,14 21,14 19,19 5,19" fill="currentColor" opacity="0.7" />
      <line x1="12" y1="4" x2="12" y2="14" stroke="white" strokeWidth="0.5" opacity="0.5" />
    </g>
  ),
  schmetterling: (
    <g>
      <ellipse cx="8" cy="10" rx="6" ry="7" fill="currentColor" opacity="0.9" transform="rotate(-15 8 10)" />
      <ellipse cx="16" cy="10" rx="6" ry="7" fill="currentColor" opacity="0.7" transform="rotate(15 16 10)" />
      <ellipse cx="9" cy="15" rx="4" ry="5" fill="currentColor" opacity="0.6" transform="rotate(-10 9 15)" />
      <ellipse cx="15" cy="15" rx="4" ry="5" fill="currentColor" opacity="0.5" transform="rotate(10 15 15)" />
      <line x1="12" y1="5" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
    </g>
  ),
  kranich: (
    <g>
      <polygon points="12,2 3,12 12,10 21,12" fill="currentColor" opacity="0.9" />
      <polygon points="3,12 12,10 8,20" fill="currentColor" opacity="0.7" />
      <polygon points="21,12 12,10 16,20" fill="currentColor" opacity="0.6" />
      <circle cx="8" cy="8" r="0.8" fill="white" />
    </g>
  ),
  frosch: (
    <g>
      <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.9" />
      <circle cx="16" cy="8" r="4" fill="currentColor" opacity="0.9" />
      <rect x="5" y="10" width="14" height="9" rx="4" fill="currentColor" opacity="0.7" />
      <circle cx="8" cy="7" r="1.5" fill="white" />
      <circle cx="16" cy="7" r="1.5" fill="white" />
      <circle cx="8" cy="7.5" r="0.8" fill="currentColor" />
      <circle cx="16" cy="7.5" r="0.8" fill="currentColor" />
    </g>
  ),
  wal: (
    <g>
      <ellipse cx="12" cy="13" rx="9" ry="6" fill="currentColor" opacity="0.9" />
      <polygon points="20,10 23,6 22,13" fill="currentColor" opacity="0.7" />
      <circle cx="7" cy="12" r="1" fill="white" />
      <path d="M10,5 Q12,2 14,5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </g>
  ),
  katze: (
    <g>
      <polygon points="5,6 2,2 8,8" fill="currentColor" opacity="0.9" />
      <polygon points="19,6 22,2 16,8" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="13" r="7" fill="currentColor" opacity="0.8" />
      <circle cx="9" cy="11" r="1.2" fill="white" />
      <circle cx="15" cy="11" r="1.2" fill="white" />
      <polygon points="12,13 11,14.5 13,14.5" fill="white" opacity="0.8" />
    </g>
  ),
  hase: (
    <g>
      <ellipse cx="9" cy="6" rx="2.5" ry="6" fill="currentColor" opacity="0.9" />
      <ellipse cx="15" cy="6" rx="2.5" ry="6" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="15" r="6" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="13" r="1" fill="white" />
      <circle cx="14" cy="13" r="1" fill="white" />
      <polygon points="12,15 11,16.5 13,16.5" fill="white" opacity="0.8" />
    </g>
  ),
  baer: (
    <g>
      <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="13" r="8" fill="currentColor" opacity="0.8" />
      <circle cx="9" cy="11" r="1.2" fill="white" />
      <circle cx="15" cy="11" r="1.2" fill="white" />
      <ellipse cx="12" cy="15" rx="3" ry="2" fill="white" opacity="0.5" />
    </g>
  ),
  vogel: (
    <g>
      <polygon points="12,3 4,12 12,10" fill="currentColor" opacity="0.9" />
      <polygon points="12,3 20,12 12,10" fill="currentColor" opacity="0.7" />
      <polygon points="12,10 6,18 18,18" fill="currentColor" opacity="0.8" />
      <circle cx="10" cy="8" r="0.8" fill="white" />
      <polygon points="4,12 1,11 4,13" fill="currentColor" opacity="0.6" />
    </g>
  ),
  fisch: (
    <g>
      <ellipse cx="11" cy="12" rx="8" ry="5" fill="currentColor" opacity="0.9" />
      <polygon points="18,12 23,7 23,17" fill="currentColor" opacity="0.7" />
      <circle cx="7" cy="11" r="1.2" fill="white" />
      <circle cx="7" cy="11.3" r="0.6" fill="currentColor" />
    </g>
  ),
};

export function OrigamiIcon({ figure, color, size = 40, className = "" }: OrigamiIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ color: color ?? "currentColor" }}
    >
      {FIGURE_PATHS[figure]}
    </svg>
  );
}
