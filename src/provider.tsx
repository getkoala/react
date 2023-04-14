import type * as Koala from "@getkoala/browser";
import * as React from "react";
import { KoalaProxy } from "./loader";

export const getKoala = () => {
  return window.ko!;
};

export interface KoalaContextType {
  ready: boolean;
  koala: Koala.KoalaSDK;
}

export const KoalaContext = React.createContext<KoalaContextType>({
  ready: false,
  koala: window.ko!,
});

export type KoalaProviderProps = React.PropsWithChildren<{
  publicApiKey?: string;
}>;

export function KoalaProvider({ children, ...settings }: KoalaProviderProps) {
  const [koala, setKoala] = React.useState<Koala.KoalaSDK>(getKoala());
  const [ready, setReady] = React.useState(false);

  // Init the Koala SDK from the given public API key.
  // Also set an on ready callback that will set the state of the provider.
  React.useEffect(() => {
    let canceled = false;

    if (!settings.publicApiKey) {
      console.error("[KOALA]", "Missing required public API key.");
      return;
    }

    KoalaProxy.ko.ready(() => {
      if (!canceled) {
        setKoala(KoalaProxy.ko);
        setReady(true);
      }
    });

    KoalaProxy.ko.init(settings.publicApiKey);

    return () => {
      canceled = true;
    };
  }, [settings.publicApiKey]);

  const state = React.useMemo(() => ({ ready, koala }), [ready, koala]);

  return (
    <KoalaContext.Provider value={state}>{children}</KoalaContext.Provider>
  );
}

export function useKoala() {
  return React.useContext(KoalaContext);
}
