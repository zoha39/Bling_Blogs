import { useEffect, useState } from "react";

const text = "BLING";

export default function LoadingScreen() {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index += 1;

      setVisibleText(text.slice(0, index));

      if (index === text.length) {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-logo">
        {visibleText}
        <span>|</span>
      </div>
    </div>
  );
}
