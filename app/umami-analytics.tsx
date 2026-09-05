"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const UMAMI_WEBSITE_ID = "9a553594-03ac-4009-a1b6-3f6267387aa6";
const TRACKED_HOSTNAMES = [
  "erkan.dev",
  "www.erkan.dev",
  "73kit.erkan.dev",
] as const;

type PrivacyNavigator = Navigator & {
  globalPrivacyControl?: boolean;
};

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
  const enabled = useSyncExternalStore(
    subscribe,
    analyticsAllowed,
    analyticsDisabledOnServer,
  );

  if (!enabled) {
    return null;
  }

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      strategy="afterInteractive"
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={TRACKED_HOSTNAMES.join(",")}
      data-do-not-track="true"
    />
  );
}
