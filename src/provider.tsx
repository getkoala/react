import * as Koala from "@getkoala/browser";
import * as React from "react";
import { setupBufferSnippet } from "./snippet";

export const getKoala = () => {
  setupBufferSnippet();
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

export type KoalaProviderProps = React.PropsWithChildren<Koala.Settings>;

export function KoalaProvider({ children, ...settings }: KoalaProviderProps) {
  const [koala, setKoala] = React.useState<Koala.KoalaSDK>(getKoala());
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let canceled = false;

    if (!settings.project) {
      console.error("Koala SDK: Missing required project attribute.");
      return;
    }

    Koala.load(settings)
      .then((ko) => {
        if (!canceled) {
          window.ko = ko;
          setKoala(ko);
        }
      })
      .catch((error) => {
        console.error("[KOALA]", "Failed to load the Koala SDK.", error);
      });

    return () => {
      canceled = true;
    };
  }, [settings]);

  React.useEffect(() => {
    koala.ready(() => setReady(true));
  }, [koala]);

  const state = React.useMemo(() => ({ ready, koala }), [ready, koala]);

  return (
    <KoalaContext.Provider value={state}>{children}</KoalaContext.Provider>
  );
}

export function useKoala() {
  return React.useContext(KoalaContext);
}
