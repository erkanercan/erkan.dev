export const EASTER_EGG_EVENT = "erkan:easter-egg-found";

export const EASTER_EGG_IDS = [
  "dog-interruption",
  "wrong-admission",
  "cw-sos",
  "boredom-glance",
] as const;

export type EasterEggId = (typeof EASTER_EGG_IDS)[number];

export function recordEasterEgg(egg: EasterEggId) {
  window.dispatchEvent(
    new CustomEvent<EasterEggId>(EASTER_EGG_EVENT, { detail: egg }),
  );
}
