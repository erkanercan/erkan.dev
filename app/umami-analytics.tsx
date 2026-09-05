"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  EASTER_EGG_EVENT,
  EASTER_EGG_IDS,
  type EasterEggId,
} from "./easter-egg-analytics";

const UMAMI_WEBSITE_ID = "9a553594-03ac-4009-a1b6-3f6267387aa6";
const TRACKED_HOSTNAMES = [
  "erkan.dev",
  "www.erkan.dev",
  "73kit.erkan.dev",
] as const;

type PrivacyNavigator = Navigator & {
  globalPrivacyControl?: boolean;
};

type UmamiWindow = Window & {
  umami?: {
    track: (eventName: string, data?: Record<string, string>) => void;
  };
};

function isEasterEggId(value: unknown): value is EasterEggId {
  return EASTER_EGG_IDS.includes(value as EasterEggId);
}

function analyticsAllowed() {
  const hostname = window.location.hostname;
  const privacyNavigator = navigator as PrivacyNavigator;

  return (
    TRACKED_HOSTNAMES.includes(hostname as (typeof TRACKED_HOSTNAMES)[number]) &&
    privacyNavigator.doNotTrack !== "1" &&
    privacyNavigator.globalPrivacyControl !== true
  );
}

function subscribe() {
  return () => undefined;
}

function analyticsDisabledOnServer() {
  return false;
}

export function UmamiAnalytics() {
  const pending = useRef(new Set<EasterEggId>());
  const seen = useRef(new Set<EasterEggId>());
  const enabled = useSyncExternalStore(
    subscribe,
    analyticsAllowed,
    analyticsDisabledOnServer,
  );

  const flushEasterEggs = useCallback(() => {
    const umami = (window as UmamiWindow).umami;
    if (!umami) return;

    for (const egg of pending.current) {
      pending.current.delete(egg);
      seen.current.add(egg);

      try {
        umami.track("easter-egg-found", { egg });
      } catch {
        // Analytics must never interfere with the page or the Easter egg.
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const record = (event: Event) => {
      const egg = (event as CustomEvent<unknown>).detail;
      if (!isEasterEggId(egg) || seen.current.has(egg)) return;

      pending.current.add(egg);
      flushEasterEggs();
    };

    window.addEventListener(EASTER_EGG_EVENT, record);
    return () => window.removeEventListener(EASTER_EGG_EVENT, record);
  }, [enabled, flushEasterEggs]);

  if (!enabled) {
    return null;
  }

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      strategy="afterInteractive"
      onReady={flushEasterEggs}
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={TRACKED_HOSTNAMES.join(",")}
      data-do-not-track="true"
    />
  );
}
