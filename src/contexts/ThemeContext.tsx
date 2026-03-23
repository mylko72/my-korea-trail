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

/**
 * 저장된 테마 또는 시스템 설정에서 초기 테마를 읽어옵니다.
 * useState 초기값 함수로 사용하여 useEffect 내 setState 호출을 피합니다.
 * 서버에서는 실행되지 않으므로 typeof window 체크가 필요합니다.
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  // localStorage에 저장된 값이 없으면 시스템 설정을 따릅니다
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// ThemeProvider 컴포넌트
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 초기값 함수를 사용해 마운트 시 1회만 실행합니다 (useEffect setState 패턴 대신)
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // DOM에 테마 클래스를 적용합니다
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // 테마 상태가 변경될 때마다 DOM과 동기화합니다
  // setState가 아닌 외부 시스템(DOM) 업데이트이므로 useEffect가 적절합니다.
  useEffect(() => {
    applyTheme(theme);
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
