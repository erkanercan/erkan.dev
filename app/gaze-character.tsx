"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { recordEasterEgg } from "./easter-egg-analytics";

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
const BOREDOM_DELAY = 12_000;
const BOREDOM_CARD_DELAY = 900;
const BOREDOM_RETURN_DELAY = 2_900;
const loadedFrames = new Set<number>();
const frameObjectUrls = new Map<number, string>();
const frameLoadPromises = new Map<number, Promise<void>>();
let progressiveLoadPromise: Promise<void> | undefined;
let priorityFramesReady = false;

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

function decodeFrame(frame: number) {
  const objectUrl = frameObjectUrls.get(frame);
  if (!objectUrl) return Promise.resolve();

  const image = new window.Image();
  image.src = objectUrl;
  return image.decode().catch(() => undefined);
}

function loadFramesProgressively() {
  if (progressiveLoadPromise) return progressiveLoadPromise;

  progressiveLoadPromise = (async () => {
    await Promise.all(PRIORITY_FRAMES.map(preloadFrame));

    for (const frame of PRIORITY_FRAMES) {
      await decodeFrame(frame);
    }

    priorityFramesReady = true;

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

type GazeCharacterProps = {
  paused?: boolean;
};

export function GazeCharacter({ paused }: GazeCharacterProps = {}) {
  const isPaused = paused ?? false;
  const visualRef = useRef<HTMLDivElement>(null);
  const frameBuffers = useRef<Array<HTMLImageElement | null>>([]);
  const desiredFrame = useRef(114);
  const currentFrame = useRef(114);
  const displayedFrame = useRef(0);
  const tracking = useRef(false);
  const engageAfter = useRef(0);
  const resumeUntil = useRef(0);
  const pointerInHero = useRef(false);
  const pausedRef = useRef(isPaused);
  const wasPaused = useRef(isPaused);
  const cancelBoredom = useRef<() => void>(() => undefined);

  useEffect(() => {
    pausedRef.current = isPaused;

    if (wasPaused.current && !isPaused) {
      engageAfter.current = performance.now() + 80;
      resumeUntil.current = performance.now() + 1100;
    }

    if (isPaused) cancelBoredom.current();

    wasPaused.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const visual = visualRef.current;
    const hero = visual?.closest<HTMLElement>("[data-hero]");
    if (!visual || !hero) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = finePointer.matches && !reducedMotion.matches;
    let frameRequest = 0;
    let lastTime = performance.now();
    let idleTimer = 0;
    let cardTimer = 0;
    let returnTimer = 0;
    let boredomUsed = false;
    let boredomActive = false;
    let pointerX = 0;
    let pointerY = 0;
    let activityX = 0;
    let activityY = 0;
    let hasPointerPosition = false;
    let pointerInDeadZone = false;
    let activeBuffer = 0;
    let paintGeneration = 0;
    let painting = false;
    let queuedPaint: { frame: number; generation: number } | undefined;

    const boredomTarget = () =>
      hero.querySelector<HTMLElement>("[data-boredom-target]");

    const clearBoredomTimers = () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(cardTimer);
      window.clearTimeout(returnTimer);
      idleTimer = 0;
      cardTimer = 0;
      returnTimer = 0;
    };

    const removeCardReaction = () => {
      boredomTarget()?.removeAttribute("data-watched");
    };

    const cancelIdleSequence = () => {
      clearBoredomTimers();
      removeCardReaction();
      boredomActive = false;
    };

    cancelBoredom.current = cancelIdleSequence;

    const showNeutral = () => {
      paintGeneration += 1;
      queuedPaint = undefined;
      tracking.current = false;
      engageAfter.current = 0;
      displayedFrame.current = 0;
      visual.dataset.gazeNeutral = "true";
    };

    const flushPaintQueue = async () => {
      if (painting) return;
      painting = true;

      while (queuedPaint) {
        const request = queuedPaint;
        queuedPaint = undefined;
        const nextBuffer = activeBuffer === 0 ? 1 : 0;
        const image = frameBuffers.current[nextBuffer];
        const objectUrl = frameObjectUrls.get(request.frame);

        if (!image || !objectUrl) continue;

        image.src = objectUrl;

        try {
          await image.decode();
        } catch {
          continue;
        }

        if (
          request.generation !== paintGeneration ||
          pausedRef.current ||
          !tracking.current
        ) {
          continue;
        }

        activeBuffer = nextBuffer;
        visual.dataset.activeFrame = String(activeBuffer);
        visual.removeAttribute("data-gaze-neutral");
        displayedFrame.current = request.frame;
      }

      painting = false;
    };

    const paintFrame = (frame: number) => {
      queuedPaint = { frame, generation: paintGeneration };
      void flushPaintQueue();
    };

    const directionFromPoint = (clientX: number, clientY: number) => {
      const bounds = visual.getBoundingClientRect();
      return frameForDirection(
        clientX - (bounds.left + bounds.width / 2),
        clientY - (bounds.top + bounds.height / 2),
      );
    };

    const beginBoredom = () => {
      const target = boredomTarget();
      if (
        !enabled ||
        pausedRef.current ||
        !pointerInHero.current ||
        !hasPointerPosition ||
        !target
      ) {
        return;
      }

      const targetBounds = target.getBoundingClientRect();
      boredomUsed = true;
      boredomActive = true;
      tracking.current = true;
      desiredFrame.current = directionFromPoint(
        targetBounds.left + targetBounds.width / 2,
        targetBounds.top + targetBounds.height / 2,
      );
      engageAfter.current = performance.now();
      resumeUntil.current = performance.now() + 1_800;

      cardTimer = window.setTimeout(() => {
        if (boredomActive && !pausedRef.current) {
          target.dataset.watched = "true";
          recordEasterEgg("boredom-glance");
        }
      }, BOREDOM_CARD_DELAY);

      returnTimer = window.setTimeout(() => {
        target.removeAttribute("data-watched");
        boredomActive = false;
        if (pointerInDeadZone) {
          showNeutral();
        } else {
          desiredFrame.current = directionFromPoint(pointerX, pointerY);
          resumeUntil.current = performance.now() + 1_200;
        }
      }, BOREDOM_RETURN_DELAY);
    };

    const scheduleBoredom = () => {
      window.clearTimeout(idleTimer);
      if (!boredomUsed && enabled && !pausedRef.current) {
        idleTimer = window.setTimeout(beginBoredom, BOREDOM_DELAY);
      }
    };

    const updateCapability = () => {
      enabled = finePointer.matches && !reducedMotion.matches;
      if (enabled) void loadFramesProgressively();
      else {
        cancelIdleSequence();
        showNeutral();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return;

      pointerInHero.current = true;
      pointerX = event.clientX;
      pointerY = event.clientY;

      const meaningfulMovement =
        !hasPointerPosition || Math.hypot(pointerX - activityX, pointerY - activityY) >= 4;

      if (meaningfulMovement) {
        activityX = pointerX;
        activityY = pointerY;
        hasPointerPosition = true;
        boredomUsed = false;
        cancelIdleSequence();
        scheduleBoredom();
      } else if (boredomActive) {
        return;
      }

      const bounds = visual.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(dx, dy);
      const deadZone = tracking.current ? 74 : 94;
      pointerInDeadZone = distance < deadZone;

      if (pointerInDeadZone) {
        showNeutral();
        return;
      }

      const nextFrame = frameForDirection(dx, dy);
      desiredFrame.current = nextFrame;

      if (pausedRef.current) {
        tracking.current = true;
        return;
      }

      if (!tracking.current) {
        currentFrame.current = nextFrame;
        engageAfter.current = performance.now() + 70;
      }

      tracking.current = true;
    };

    const handlePointerLeave = () => {
      pointerInHero.current = false;
      hasPointerPosition = false;
      pointerInDeadZone = false;
      boredomUsed = false;
      cancelIdleSequence();
      showNeutral();
    };

    const animate = (time: number) => {
      const elapsed = Math.min(time - lastTime, 48);
      lastTime = time;

      if (
        enabled &&
        priorityFramesReady &&
        !pausedRef.current &&
        pointerInHero.current &&
        tracking.current
      ) {
        const difference = circularDelta(currentFrame.current, desiredFrame.current);
        const resuming = time < resumeUntil.current;
        const easing = 1 - Math.exp(-elapsed / (resuming ? 420 : 105));
        const maxStep = resuming ? 1.15 : 3.2;
        const step = Math.sign(difference) * Math.min(Math.abs(difference) * easing, maxStep);
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
          paintFrame(closest);
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
      cancelIdleSequence();
      cancelBoredom.current = () => undefined;
    };
  }, []);

  return (
    <div
      ref={visualRef}
      className="character-visual"
      data-active-frame="0"
      data-gaze-neutral="true"
      data-gaze-paused={isPaused || undefined}
      aria-hidden="true"
    >
      <Image
        ref={(image) => {
          frameBuffers.current[0] = image;
        }}
        className="character-image character-frame-buffer"
        data-frame-buffer="0"
        src={NEUTRAL_SRC}
        alt=""
        width={1920}
        height={1080}
        sizes="(max-width: 767px) 120vw, (max-width: 1100px) 72vw, 62vw"
        fetchPriority="high"
        loading="eager"
        unoptimized
      />
      <Image
        ref={(image) => {
          frameBuffers.current[1] = image;
        }}
        className="character-image character-frame-buffer"
        data-frame-buffer="1"
        src={NEUTRAL_SRC}
        alt=""
        width={1920}
        height={1080}
        sizes="(max-width: 767px) 120vw, (max-width: 1100px) 72vw, 62vw"
        loading="eager"
        unoptimized
      />
      <Image
        className="character-image character-neutral-transition"
        src={NEUTRAL_SRC}
        alt=""
        width={1920}
        height={1080}
        sizes="(max-width: 767px) 120vw, (max-width: 1100px) 72vw, 62vw"
        loading="eager"
        unoptimized
      />
    </div>
  );
}
