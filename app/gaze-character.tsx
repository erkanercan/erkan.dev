"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FIRST_LOOP_FRAME = 16;
const LAST_LOOP_FRAME = 120;
const LOOP_FRAME_COUNT = LAST_LOOP_FRAME - FIRST_LOOP_FRAME + 1;
// Bump this whenever the rendered character files change. The matching HTTP
// cache policy can then stay immutable without serving stale artwork.
const ASSET_VERSION = "1";
const NEUTRAL_SRC = `/character/neutral.webp?v=${ASSET_VERSION}`;
const DIRECTION_SEGMENTS = [
  { start: 0, end: 0.125, from: 114, to: 120 },
  { start: 0.125, end: 0.25, from: 16, to: 39 },
  { start: 0.25, end: 0.375, from: 39, to: 55 },
  { start: 0.375, end: 0.5, from: 55, to: 70 },
  { start: 0.5, end: 0.625, from: 70, to: 84 },
  { start: 0.625, end: 0.75, from: 84, to: 96 },
  { start: 0.75, end: 0.875, from: 96, to: 108 },
  { start: 0.875, end: 1, from: 108, to: 114 },
] as const;

const PRIORITY_FRAMES = [16, 22, 39, 55, 70, 84, 96, 108, 114, 120];
const loadedFrames = new Set<number>();
const frameObjectUrls = new Map<number, string>();
const frameLoadPromises = new Map<number, Promise<void>>();
let progressiveLoadPromise: Promise<void> | undefined;

function frameSrc(frame: number) {
  return `/character/loop/frame-${String(frame).padStart(3, "0")}.webp?v=${ASSET_VERSION}`;
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function circularDelta(from: number, to: number) {
  return (
    positiveModulo(to - from + LOOP_FRAME_COUNT / 2, LOOP_FRAME_COUNT) -
    LOOP_FRAME_COUNT / 2
  );
}

function frameForDirection(dx: number, dy: number) {
  const angle = Math.atan2(dy, dx);
  const progress = positiveModulo(angle - Math.PI, Math.PI * 2) / (Math.PI * 2);
  const segment =
    DIRECTION_SEGMENTS.find(({ end }) => progress <= end) ??
    DIRECTION_SEGMENTS[DIRECTION_SEGMENTS.length - 1];
  const segmentProgress = (progress - segment.start) / (segment.end - segment.start);

  return segment.from + (segment.to - segment.from) * segmentProgress;
}

function nearestLoadedFrame(target: number, loaded: Set<number>) {
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const frame of loaded) {
    const distance = Math.abs(circularDelta(target, frame));
    if (distance < nearestDistance) {
      nearest = frame;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function preloadFrame(frame: number) {
  if (loadedFrames.has(frame)) return Promise.resolve();

  const existing = frameLoadPromises.get(frame);
  if (existing) return existing;

  const promise = fetch(frameSrc(frame), { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load character frame ${frame}`);
      return response.blob();
    })
    .then((blob) => {
      frameObjectUrls.set(frame, URL.createObjectURL(blob));
      loadedFrames.add(frame);
    })
    .catch(() => {
      frameLoadPromises.delete(frame);
    });

  frameLoadPromises.set(frame, promise);
  return promise;
}

function loadFramesProgressively() {
  if (progressiveLoadPromise) return progressiveLoadPromise;

  progressiveLoadPromise = (async () => {
    await Promise.all(PRIORITY_FRAMES.map(preloadFrame));

    const remaining = Array.from(
      { length: LOOP_FRAME_COUNT },
      (_, index) => FIRST_LOOP_FRAME + index,
    )
      .filter((frame) => !loadedFrames.has(frame));

    for (let index = 0; index < remaining.length; index += 8) {
      await Promise.all(remaining.slice(index, index + 8).map(preloadFrame));
      await new Promise<void>((resolve) => window.setTimeout(resolve, 35));
    }
  })();

  return progressiveLoadPromise;
}

export function GazeCharacter() {
  const visualRef = useRef<HTMLDivElement>(null);
  const desiredFrame = useRef(114);
  const currentFrame = useRef(114);
  const displayedFrame = useRef(0);
  const tracking = useRef(false);
  const engageAfter = useRef(0);
  const pointerInHero = useRef(false);
  const [source, setSource] = useState(NEUTRAL_SRC);

  useEffect(() => {
    const visual = visualRef.current;
    const hero = visual?.closest<HTMLElement>("[data-hero]");
    if (!visual || !hero) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = finePointer.matches && !reducedMotion.matches;
    let frameRequest = 0;
    let lastTime = performance.now();

    const showNeutral = () => {
      tracking.current = false;
      engageAfter.current = 0;
      displayedFrame.current = 0;
      setSource(NEUTRAL_SRC);
    };

    const updateCapability = () => {
      enabled = finePointer.matches && !reducedMotion.matches;
      if (enabled) void loadFramesProgressively();
      else showNeutral();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return;

      pointerInHero.current = true;
      const bounds = visual.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(dx, dy);
      const deadZone = tracking.current ? 74 : 94;

      if (distance < deadZone) {
        showNeutral();
        return;
      }

      const nextFrame = frameForDirection(dx, dy);
      desiredFrame.current = nextFrame;

      if (!tracking.current) {
        currentFrame.current = nextFrame;
        engageAfter.current = performance.now() + 70;
      }

      tracking.current = true;
    };

    const handlePointerLeave = () => {
      pointerInHero.current = false;
      showNeutral();
    };

    const animate = (time: number) => {
      const elapsed = Math.min(time - lastTime, 48);
      lastTime = time;

      if (enabled && pointerInHero.current && tracking.current) {
        const difference = circularDelta(currentFrame.current, desiredFrame.current);
        const easing = 1 - Math.exp(-elapsed / 105);
        const step = Math.sign(difference) * Math.min(Math.abs(difference) * easing, 3.2);
        currentFrame.current =
          positiveModulo(
            currentFrame.current - FIRST_LOOP_FRAME + step,
            LOOP_FRAME_COUNT,
          ) + FIRST_LOOP_FRAME;

        const closest = nearestLoadedFrame(currentFrame.current, loadedFrames);
        if (
          time >= engageAfter.current &&
          closest &&
          closest !== displayedFrame.current
        ) {
          const objectUrl = frameObjectUrls.get(closest);
          if (!objectUrl) {
            frameRequest = requestAnimationFrame(animate);
            return;
          }
          displayedFrame.current = closest;
          setSource(objectUrl);
        }
      }

      frameRequest = requestAnimationFrame(animate);
    };

    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    finePointer.addEventListener("change", updateCapability);
    reducedMotion.addEventListener("change", updateCapability);
    frameRequest = requestAnimationFrame(animate);

    if (enabled) void loadFramesProgressively();

    return () => {
      cancelAnimationFrame(frameRequest);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      finePointer.removeEventListener("change", updateCapability);
      reducedMotion.removeEventListener("change", updateCapability);
    };
  }, []);

  return (
    <div ref={visualRef} className="character-visual" aria-hidden="true">
      <Image
        className="character-image"
        src={source}
        alt=""
        width={1920}
        height={1080}
        sizes="(max-width: 767px) 120vw, (max-width: 1100px) 72vw, 62vw"
        fetchPriority="high"
        loading="eager"
        unoptimized
      />
    </div>
  );
}
