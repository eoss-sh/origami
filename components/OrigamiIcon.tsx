"use client";

import Image from "next/image";
import type { OrigamiFigure } from "@/types";

interface OrigamiIconProps {
  figure: OrigamiFigure;
  color?: string;
  size?: number;
  className?: string;
}

const FIGURE_ASSETS: Record<OrigamiFigure, string> = {
  boot: "/assets/00_boat.svg",
  frosch: "/assets/03_frog.svg",
  fisch: "/assets/09_fish.svg",
  vogel: "/assets/02_sparrow-flying.svg",
  wal: "/assets/11_whale.svg",
  schmetterling: "/assets/17_butterfly.svg",
  kranich: "/assets/15_dove.svg",
  fuchs: "/assets/14_dog-face.svg",
  katze: "/assets/13_ostrich.svg",
  hase: "/assets/18_kangaroo.svg",
  baer: "/assets/10_elephant.svg",
};

export function OrigamiIcon({ figure, size = 36, className = "" }: OrigamiIconProps) {
  return (
    <Image
      src={FIGURE_ASSETS[figure]}
      alt={figure}
      width={size}
      height={size}
      className={className}
    />
  );
}
