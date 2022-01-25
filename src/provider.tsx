import * as React from "react";
import * as Koala from "@koala-live/browser";
import { setupBufferSnippet } from "./snippet";

export const getKoala = () => {
  setupBufferSnippet();
  return window.ko!;
};

export const KoalaContext = React.createContext<Koala.KoalaSDK>(window.ko!);

export type KoalaProviderProps = React.PropsWithChildren<Koala.Settings>;

export function KoalaProvider({ children, ...settings }: KoalaProviderProps) {
  const [koala, setKoala] = React.useState<Koala.KoalaSDK>(getKoala());

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

  return (
    <KoalaContext.Provider value={koala}>{children}</KoalaContext.Provider>
  );
}

export function useKoala() {
  return React.useContext(KoalaContext);
}
