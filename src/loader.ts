import type { KoalaSDK } from "@getkoala/browser";

declare global {
  interface Window {
    ko?: KoalaSDK;
  }
}

const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

const methods = [
  "identify",
  "track",
  "removeListeners",
  "open",
  "on",
  "off",
  "qualify",
  "ready",
];

const koBuffer: any = [];

// immediately create buffered methods
methods.forEach((method) => {
  koBuffer[method] = (...args: unknown[]) => {
    args.unshift(method);
    koBuffer.push(args);
  };
});

if (isBrowser && !window.ko) {
  window.ko = koBuffer;
}

const Koala = isBrowser ? window.ko : koBuffer;

let invoked = false;

function init(publicApiKey: string) {
  if (invoked) return;

  if (!publicApiKey || typeof publicApiKey !== "string") {
    console.error("[KOALA]", "Missing required public API key");
    return;
  }

  if (!isBrowser) return;

  // Ensure the SDK is loaded only once
  if (window.ko && !Array.isArray(window.ko)) {
    console.warn(
      "[KOALA]",
      "The Koala SDK is already initialized. Either it has already been loaded on the page from another install or you called `init` more than once. Calling `init` again will have no effect."
    );
    return;
  }

  invoked = true;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://cdn.getkoala.com/v1/${publicApiKey}/sdk.js`;

  const first = document.getElementsByTagName("script")[0];
  if (first && first.parentNode) {
    first.parentNode.insertBefore(script, first);
  }
}

// define a getter that proxies the Koala window object
const KoalaProxy = {
  get ko() {
    const ko: any = isBrowser ? window.ko : Koala;

    if (!ko.init) {
      ko.init = init;
    }

    return ko as KoalaSDK & { init: typeof init };
  },
};

export { KoalaProxy };
