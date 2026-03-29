"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// 테마 타입 정의
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider 컴포넌트
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /**
   * Hydration 불일치 방지 전략:
   * - 서버와 클라이언트 첫 렌더링 모두 "light"로 고정합니다.
   * - 마운트(useEffect) 이후 localStorage/시스템 설정을 읽어 실제 테마로 동기화합니다.
   * - 이 방식으로 서버 HTML과 클라이언트 초기 렌더가 항상 일치합니다.
   */
  const [theme, setThemeState] = useState<Theme>("light");

  // 마운트 후 저장된 테마 또는 시스템 설정을 읽어 동기화합니다
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme);
      return;
    }
    // 저장된 값이 없으면 시스템 설정을 따릅니다
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
  }, []);

  // 테마 상태가 변경될 때마다 DOM 클래스를 동기화합니다
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 테마 변경 함수
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 테마 토글 함수
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// useTheme 훅
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme는 ThemeProvider 내부에서 사용해야 합니다.");
  }
  return context;
}
