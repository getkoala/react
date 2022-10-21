import type * as Koala from "@getkoala/browser";
export * from "@getkoala/browser";
export * from "./provider";

declare global {
  interface Window {
    ko?: Koala.KoalaSDK;
  }
}
