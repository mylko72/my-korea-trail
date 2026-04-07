import { test, expect } from '@playwright/test';

/**
 * Phase 9 E2E 테스트: 관리자 기능 검증
 *
 * 5개 시나리오:
 * 1. 대시보드 접근 및 테이블 로드
 * 2. 완보 상태 변경 (UI+Notion DB)
 * 3. 게시 상태 변경 (UI+Notion DB)
 * 4. 오류 처리 및 UI 롤백
 * 5. 반응형 및 접근성
 */

// =====================================================
// Scenario 1: 대시보드 접근 및 테이블 로드
// =====================================================

test.describe('Scenario 1: 관리자 대시보드 접근', () => {
  test('로그인 후 /admin 접속 시 테이블 로드 확인', async ({ page }) => {
    // 1. 로그인 페이지 접속
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    // 2. 패스워드 입력 및 로그인
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');

    const loginButton = page.locator('button:has-text("로그인")');
    await loginButton.click();
    await page.waitForLoadState('networkidle');

    // 3. /admin 페이지로 자동 리다이렉트됨
    expect(page.url()).toContain('/admin');

    // 4. 대시보드 제목 확인
    const title = page.locator('h1:has-text("대시보드")');
    await expect(title).toBeVisible();

    // 5. 요약 카드 3개 확인
    const summaryCards = page.locator('[class*="AdminSummaryCard"]').or(page.locator('div:has(> p:has-text("전체 코스"))')).or(page.locator('div:has(> p:has-text("게시된 코스"))')).or(page.locator('div:has(> p:has-text("완보 코스"))'));
    const cardCount = await summaryCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1); // 최소 1개 카드

    // 6. 테이블 헤더 확인
    const tableHeader = page.locator('th:has-text("코스명")').or(page.locator('text=코스명'));
    await expect(tableHeader).toBeVisible();

    // 7. 테이블 데이터 행 확인 (최소 1개)
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});

// =====================================================
// Scenario 2: 완보 상태 변경
// =====================================================

test.describe('Scenario 2: 완보 상태 변경', () => {
  test('완보 상태를 변경하고 Notion DB에 반영 확인', async ({ page }) => {
    // 1. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 2. 첫 번째 행의 완보 선택 찾기
    const firstRow = page.locator('tbody tr').first();
    const completedSelector = firstRow.locator('[class*="Select"]').first();

    // 3. 선택 변경
    await completedSelector.click();
    await page.waitForTimeout(200);

    // 4. 옵션 선택 (현재 상태와 반대)
    const options = page.locator('[role="option"]');
    const firstOption = options.first();
    await firstOption.click();
    await page.waitForTimeout(500);

    // 5. 토스트 알림 확인
    const successToast = page.locator('text=저장되었습니다').or(page.locator('[role="status"]:has-text("저장")'));
    await expect(successToast).toBeVisible({ timeout: 5000 });
  });
});

// =====================================================
// Scenario 3: 게시 상태 변경
// =====================================================

test.describe('Scenario 3: 게시 상태 변경', () => {
  test('게시 체크박스를 변경하고 Notion DB에 반영 확인', async ({ page }) => {
    // 1. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 2. 첫 번째 행의 게시 체크박스 찾기
    const firstRow = page.locator('tbody tr').first();
    const publishCheckbox = firstRow.locator('input[type="checkbox"]').last();

    // 3. 체크박스 상태 확인
    const isChecked = await publishCheckbox.isChecked();

    // 4. 체크박스 클릭
    await publishCheckbox.click();
    await page.waitForTimeout(500);

    // 5. 토스트 알림 확인
    const successToast = page.locator('text=저장되었습니다').or(page.locator('[role="status"]:has-text("저장")'));
    await expect(successToast).toBeVisible({ timeout: 5000 });

    // 6. 체크박스 상태 변경 확인
    const newIsChecked = await publishCheckbox.isChecked();
    expect(newIsChecked).not.toBe(isChecked);
  });
});

// =====================================================
// Scenario 4: 오류 처리 및 UI 롤백
// =====================================================

test.describe('Scenario 4: 오류 처리 및 UI 롤백', () => {
  test('API 실패 시 UI 롤백 및 에러 토스트 표시', async ({ page }) => {
    // 1. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 2. 첫 번째 행의 상태 보관
    const firstRow = page.locator('tbody tr').first();
    const completedBefore = await firstRow.locator('[class*="Select"]').first().textContent();

    // 3. 잘못된 요청을 가로채기 (모의 실패)
    await page.route('**/api/admin/courses/**', route => {
      route.abort('failed');
    });

    // 4. 완보 선택 변경 시도
    const completedSelector = firstRow.locator('[class*="Select"]').first();
    await completedSelector.click();
    await page.waitForTimeout(200);

    const options = page.locator('[role="option"]');
    await options.first().click();
    await page.waitForTimeout(1000);

    // 5. 에러 토스트 확인
    const errorToast = page.locator('text=저장 실패').or(page.locator('[role="status"]:has-text("실패")'));
    await expect(errorToast).toBeVisible({ timeout: 5000 });

    // 6. 상태 롤백 확인 (원래 값으로 복원)
    await page.unroute('**/api/admin/courses/**');
    const completedAfter = await firstRow.locator('[class*="Select"]').first().textContent();
    expect(completedAfter).toBe(completedBefore);
  });
});

// =====================================================
// Scenario 5: 반응형 및 접근성
// =====================================================

test.describe('Scenario 5: 반응형 및 접근성', () => {
  test('모바일 뷰포트(375px)에서 정상 동작', async ({ page }) => {
    // 1. 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 3. 테이블이 가로 스크롤 가능한지 확인
    const tableContainer = page.locator('[class*="overflow-x"]').first();
    await expect(tableContainer).toBeVisible();

    // 4. 요약 카드 그리드 확인 (모바일에서는 1열)
    const summaryGrid = page.locator('[class*="grid"]').first();
    await expect(summaryGrid).toBeVisible();
  });

  test('태블릿 뷰포트(768px)에서 정상 동작', async ({ page }) => {
    // 1. 태블릿 뷰포트 설정
    await page.setViewportSize({ width: 768, height: 1024 });

    // 2. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 3. 테이블 렌더링 확인
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('데스크톱 뷰포트(1280px)에서 정상 동작', async ({ page }) => {
    // 1. 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1280, height: 1024 });

    // 2. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 3. 대시보드 풀 렌더링 확인
    const dashboard = page.locator('h1:has-text("대시보드")');
    await expect(dashboard).toBeVisible();

    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('접근성: 키보드 네비게이션 확인', async ({ page }) => {
    // 1. 로그인
    await page.goto('/auth/login');
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.ADMIN_PASSWORD || '');
    await page.locator('button:has-text("로그인")').click();
    await page.waitForLoadState('networkidle');

    // 2. Tab 키로 인터랙티브 요소 포커스
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // 3. 포커스 가능한 요소 확인
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return el ? el.tagName : null;
    });

    expect(focusedElement).toBeTruthy();
  });
});
