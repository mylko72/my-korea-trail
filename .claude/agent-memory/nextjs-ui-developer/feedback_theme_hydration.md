---
name: 다크모드 Hydration 에러 방지 패턴
description: ThemeContext에서 localStorage 기반 다크모드 초기값이 서버/클라이언트 불일치를 유발하는 패턴과 해결책
type: feedback
---

`useState(getInitialTheme)` 패턴에서 `getInitialTheme()`이 서버에서는 `"light"`를 반환하지만 클라이언트 첫 렌더링 시 `localStorage`에서 `"dark"`를 읽어 Hydration 불일치가 발생한다.

**올바른 패턴:**
```tsx
// 초기 상태는 항상 "light"로 고정 (서버/클라이언트 동일)
const [theme, setThemeState] = useState<Theme>("light");

// 마운트 후 localStorage/시스템 설정으로 동기화
useEffect(() => {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") {
    setThemeState(saved);
    return;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setThemeState("dark");
  }
}, []);
```

**Why:** 서버 렌더링 시 `localStorage` 접근 불가이므로, 서버와 클라이언트 첫 렌더가 동일한 `"light"` 상태로 시작해야 Hydration이 일치한다. 실제 테마 동기화는 마운트 이후 `useEffect`에서 처리한다.

**How to apply:** `ThemeContext`, `next-themes`, 또는 다크모드를 `localStorage`로 관리하는 모든 Client Component에 동일하게 적용한다. `suppressHydrationWarning`만으로는 근본적인 해결이 안 된다.
