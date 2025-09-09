import { useEffect, useState } from "react";

export default function App() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const showIOSInstallBanner = isIOS && !isStandalone;
  const isInstalled = usePwaMode();

  // on page load
  useEffect(() => {
    const handler = (e: any) => {
      // die Standardreaktion auf das Event verhindern
      e.preventDefault();

      // Stattdessen das Event speichern und
      setPromptEvent(e);

      // den setShowInstall-State auf true setzen und somit nen Button anzeigen!
      setShowInstall(true); // Android/Chrome zeigt dann Button
    };

    // Höre auf das Browserspezifische "beforeinstallprompt"-Event, das kommt wenn die PWA installierbar ist!
    // Da machen wir aber ne eigene Reaktion drauf!
    window.addEventListener("beforeinstallprompt", handler);

    // Glaub das hier ist cleanup
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Install-Methode, verwende die Native Funktionalität für install
  const install = async () => {
    if (!promptEvent) return;

    // Öffne den nativen Install-Prompt
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    setShowInstall(false);
  };

  // Check-Methode bzw hook: ist App installiert oder im Browser?
  function usePwaMode() {
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
      const checkMode = () => {
        const standalone = window.matchMedia(
          "(display-mode: standalone)"
        ).matches;
        const iosStandalone = (window.navigator as any).standalone === true;
        setIsInstalled(standalone || iosStandalone);
      };

      checkMode();

      // Re-check when display-mode changes (z. B. bei Reload)
      window
        .matchMedia("(display-mode: standalone)")
        .addEventListener("change", checkMode);

      return () => {
        window
          .matchMedia("(display-mode: standalone)")
          .removeEventListener("change", checkMode);
      };
    }, []);

    return isInstalled;
  }

  return (
    <main style={{ padding: 24 }}>
      {isInstalled ? <h1>Install erfolgreich!</h1> : <h1>Hallo!</h1>}

      {/* Zeige den normalen Install-Button wenn nicht-iOS erkannt wurde und das "beforeinstallprompt"-Event 
      vom Browser gefeuert wurde 
      Nach Install (Aufruf der install-Methode) wird der Button deaktiviert!*/}

      {!showIOSInstallBanner && showInstall && (
        <button onClick={install}>Jetzt App installieren</button>
      )}

      {/* Da das "beforeinstallprompt"-Event von Safari/iOS nicht gefeuert wird, mach in diesem Fall ne
      spezielle Install-Anleitung */}

      {showIOSInstallBanner && (
        <div
          style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12 }}
        >
          <strong>iOS:</strong> Öffne das <em>Teilen</em>-Menü und tippe auf
          <em> „Zum Home-Bildschirm“</em>, um die App zu installieren.
        </div>
      )}

      {/*     
       <p>Status: {navigator.onLine ? "Online" : "Offline"}</p>


         <p>Flag status: isInstalled {isInstalled ? "true" : "false"}</p>

      
      <p>
        Flag status: showIOSInstallBanner
        {showIOSInstallBanner ? "true" : "false"}
      </p>
     
      <p>Flag status: isStandalone {isStandalone ? "true" : "false"}</p>  */}
    </main>
  );
}
