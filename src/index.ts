import type * as Koala from "@koala-live/browser";
export * from "@koala-live/browser";
export * from "./provider";

declare global {
  interface Window {
    ko?: Koala.KoalaSDK;
  }
}
