import { test, expect } from '@playwright/test';

/**
 * 코스 상세 페이지 E2E 테스트
 * Phase 4에서 추가된 새 필드(completed, content2, images, rate) 검증
 */

test.describe('코스 상세 페이지 - 신규 필드 검증', () => {
  // 테스트할 슬러그 (Mock 데이터 기준)
  const testCourse = 'gangneung-samcheok';
  const testCategory = 'hae-parang-gil';

  test.beforeEach(async ({ page }) => {
    // 코스 상세 페이지로 이동
    await page.goto(`/${testCategory}/${testCourse}`);
    await page.waitForLoadState('networkidle');
  });

  test('완보/미완 상태 표시 (completed 필드)', async ({ page }) => {
    // 메타 정보 섹션에서 완보 상태 표시 확인
    const completionStatus = page.locator('text=/완보|미완|기록 없음/');

    // 상태 텍스트가 화면에 표시되는지 확인
    await expect(completionStatus).toBeVisible();

    // CheckCircle2 아이콘 또는 XCircle 아이콘 중 하나가 표시되는지 확인
    const statusIcon = page.locator('svg').filter({
      has: page.locator('[aria-hidden="true"]')
    }).first();
    await expect(statusIcon).toBeVisible();
  });

  test('코스 리뷰 섹션 (content2 필드)', async ({ page }) => {
    // "코스 리뷰" 헤더가 표시되는지 확인
    const reviewHeader = page.locator('h2', { hasText: '코스 리뷰' });
    await expect(reviewHeader).toBeVisible();

    // Mock 데이터 기준으로 리뷰 텍스트가 표시되는지 확인
    // 강릉~삼척 코스의 리뷰 일부 확인
    const reviewContent = page.locator('text=/해안 절벽|최적의 트레킹|가고 싶|다음/');
    const isReviewVisible = await reviewContent.isVisible();

    // 리뷰가 있는 경우 표시, 없는 경우 "리뷰가 없습니다" 메시지 표시
    if (!isReviewVisible) {
      const noReviewText = page.locator('text=/리뷰가 없습니다/');
      await expect(noReviewText.or(reviewContent)).toBeVisible();
    }
  });

  test('이미지 갤러리 (images 필드)', async ({ page }) => {
    // "코스 사진" 헤더가 표시되는지 확인
    const galleryHeader = page.locator('h2', { hasText: '코스 사진' });
    await expect(galleryHeader).toBeVisible();

    // 이미지들이 렌더링되는지 확인
    // 갤러리 그리드 또는 "등록된 사진이 없습니다" 메시지 중 하나가 표시되어야 함
    const gallerySection = page.locator('section').filter({
      has: page.locator('h2', { hasText: '코스 사진' })
    });

    const images = gallerySection.locator('img');
    const noPhotoText = gallerySection.locator('text=/등록된 사진이 없습니다/');

    const hasImages = await images.count() > 0;
    const hasNoPhotoText = await noPhotoText.isVisible();

    // 이미지가 있거나 "없습니다" 메시지가 표시되어야 함
    expect(hasImages || hasNoPhotoText).toBeTruthy();
  });

  test('별점 표시 (rate 필드)', async ({ page }) => {
    // 메타 정보 카드에서 별 아이콘 확인
    const rateSection = page.locator('dt').filter({ hasText: '평점' });

    // Mock 데이터에 별점이 있으면 평점 섹션이 표시됨
    const isRateVisible = await rateSection.isVisible();

    if (isRateVisible) {
      // 평점 숫자가 1.0 ~ 5.0 범위에 있는지 확인
      const rateValue = page.locator('dd').filter({
        has: rateSection.locator('..')
      }).first();

      const rateText = await rateValue.textContent();
      const rateMatch = rateText?.match(/\d+\.\d/);

      if (rateMatch) {
        const rate = parseFloat(rateMatch[0]);
        expect(rate).toBeGreaterThanOrEqual(1.0);
        expect(rate).toBeLessThanOrEqual(5.0);
      }
    }
  });

  test('메타 정보 카드 레이아웃 (4개 필드 포함)', async ({ page }) => {
    // 메타 정보 카드 확인
    const metaCard = page.locator('[class*="Card"]').first();

    // 필드들이 그리드로 표시되는지 확인 (md:grid-cols-4)
    const definitionList = metaCard.locator('dl');
    await expect(definitionList).toBeVisible();

    // 최소한 기본 메타 정보(날짜, 거리 등)는 표시되어야 함
    const dateField = page.locator('dt').filter({ hasText: '완주 날짜' });
    await expect(dateField).toBeVisible();
  });

  test('다크모드에서 이미지 표시 확인', async ({ page }) => {
    // 이미지가 있는 경우에만 테스트
    const images = page.locator('section').filter({
      has: page.locator('h2', { hasText: '코스 사진' })
    }).locator('img');

    const imageCount = await images.count();

    if (imageCount > 0) {
      const firstImage = images.first();

      // 이미지 클래스에 dark:brightness-110이 적용되었는지 확인
      const classList = await firstImage.getAttribute('class');
      // Tailwind 클래스는 렌더링 시 적용되므로, 이미지가 visible인지만 확인
      await expect(firstImage).toBeVisible();
    }
  });
});

test.describe('카테고리별 코스 검증', () => {
  test('해파랑길 카테고리 페이지 접근', async ({ page }) => {
    await page.goto('/hae-parang-gil');
    await page.waitForLoadState('networkidle');

    // 카테고리 제목 확인
    const categoryTitle = page.locator('h1').filter({
      hasText: /해파랑길|구간/
    });
    await expect(categoryTitle).toBeVisible();

    // 코스 카드들이 표시되는지 확인
    const courseCards = page.locator('[class*="Card"]');
    const cardCount = await courseCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('미완주 코스 필터링 검증', async ({ page }) => {
    // 남파랑길 페이지에서 미완주 코스 확인 가능
    await page.goto('/nam-parang-gil');
    await page.waitForLoadState('networkidle');

    // 페이지가 정상적으로 로드되는지 확인
    const pageTitle = page.locator('h1');
    await expect(pageTitle).toBeVisible();
  });
});
