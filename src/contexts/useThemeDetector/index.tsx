import { useEffect, useState } from "react";

export const useThemeDetector = () => {
  const getCurrentTheme = () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)")?.matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());  
  const mqListener = ((e: any) => {
      setIsDarkTheme(e?.matches);
  });

  const swapTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  }
  
  useEffect(() => {
    if(typeof window !== "undefined"){
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      darkThemeMq.addListener(mqListener);
      return () => darkThemeMq.removeListener(mqListener);
    }
    return () => {};
    
  }, []);
  return { isDarkTheme, swapTheme};
}