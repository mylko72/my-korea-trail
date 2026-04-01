# Notion 데이터베이스 설정 가이드

> 코리아 둘레길 기록 블로그의 Notion CMS 데이터베이스 설정 방법

---

## 📋 개요

이 가이드는 Notion 데이터베이스를 **코리아 둘레길 기록 블로그** 프로젝트에 맞게 설정하는 방법을 단계별로 설명합니다.

프로젝트의 `src/lib/notion.ts`에서는 Notion 데이터베이스의 속성(필드)을 아래의 **정확한 이름**으로 매핑합니다.
속성명이 정확히 일치하지 않으면 데이터를 가져올 수 없으니 주의하세요.

---

## 🗄️ 필드 정의 (16개 필수)

| 순번 | Notion 필드명 | 타입 | 필수 | 예시 | 설명 |
|---|---|---|---|---|---|
| 1 | **Title** | Title | ✅ | 강릉~삼척 구간 | 코스명 (페이지 기본 제목 속성) |
| 2 | **Category** | Select | ✅ | 해파랑길 | 카테고리: 해파랑길, 남파랑길, 서해랑길, DMZ 평화의 길 |
| 3 | **Slug** | Rich Text | ✅ | gangneung-samcheok | URL 슬러그 (소문자, 영문, 하이픈만 사용) |
| 4 | **Date** | Date | ✅ | 2026-03-15 | 완주 날짜 (YYYY-MM-DD 형식) |
| 5 | **CoverImage** | Files | ❌ | [이미지 파일] | 대표 이미지 (Notion 내부 또는 외부 URL) |
| 6 | **Description** | Rich Text | ❌ | 강원도 해안선을 따라... | 코스 요약 (100~200자 권장) |
| 7 | **Distance** | Number | ❌ | 33.5 | 거리 (km, 소수점 허용) |
| 8 | **Duration** | Number | ❌ | 330 | 소요 시간 (분 단위, 예: 330분 = 5.5시간) |
| 9 | **Difficulty** | Select | ❌ | 보통 | 난이도: 쉬움, 보통, 어려움 |
| 10 | **StartLocation** | Rich Text | ❌ | `{"lat":37.75,"lng":129.10}` | 시작 지점 좌표 (JSON 형식) |
| 11 | **EndLocation** | Rich Text | ❌ | `{"lat":37.50,"lng":129.00}` | 종료 지점 좌표 (JSON 형식) |
| 12 | **Published** | Checkbox | ✅ | ☑️ (체크됨) | 게시 여부 (체크=공개, 미체크=비공개) |
| 13 | **Completed** | Select | ❌ | 완보 | 완보 여부: 완보, 미완 |
| 14 | **Content2** | Rich Text | ❌ | 이 구간은 정말 좋았어요... | 코스 리뷰 (마크다운 형식 지원) |
| 15 | **Images** | Files | ❌ | [이미지 1], [이미지 2] | 코스 사진 (여러 장 가능) |
| 16 | **Rate** | Number | ❌ | 4.5 | 별점 (1.0 ~ 5.0) |

---

## 📌 필드별 상세 설정 가이드

### 1️⃣ Title (필드명: `Title`)

- **타입**: Title *(기본 속성)*
- **필수**: ✅ 필수
- **설명**: Notion 페이지의 기본 제목 속성입니다. 모든 페이지는 제목이 있어야 합니다.
- **예시**: "강릉~삼척 구간", "속초~고성 해안길"
- **설정 방법**:
  - Notion에서 새 Database 생성 시 기본으로 생성됨
  - 페이지마다 제목 입력

---

### 2️⃣ Category (필드명: `Category`)

- **타입**: Select *(단일 선택)*
- **필수**: ✅ 필수
- **설명**: 둘레길 구간을 분류하는 카테고리입니다. 하나의 옵션만 선택 가능합니다.
- **선택지** (반드시 이 4개만 생성):
  - `해파랑길` (색상: 파란색 권장)
  - `남파랑길` (색상: 초록색 권장)
  - `서해랑길` (색상: 주황색 권장)
  - `DMZ 평화의 길` (색상: 보라색 권장)
- **예시**: `해파랑길` 선택
- **설정 방법**:
  1. Database에서 "+" 버튼으로 새 속성 추가
  2. 속성명: `Category`
  3. 타입: `Select`
  4. "Select options" 클릭 → 위의 5개 옵션 모두 추가

---

### 3️⃣ Slug (필드명: `Slug`)

- **타입**: Rich Text
- **필수**: ✅ 필수 (비워두면 Page ID 자동 사용)
- **설명**: URL에 사용될 고유 슬러그입니다. 영문 소문자, 숫자, 하이픈만 허용합니다.
- **규칙**:
  - 특수문자 제거 (`,`, `~`, `.` 등)
  - 공백은 하이픈(`-`)으로 대체
  - 모두 소문자
- **예시**:
  - "강릉~삼척 해파랑길" → `gangneung-samcheok-haebarang`
  - "속초~고성 구간" → `sokcho-goseong-section`
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Slug`
  3. 타입: `Rich Text`
  4. 각 페이지에서 슬러그 입력

---

### 4️⃣ Date (필드명: `Date`)

- **타입**: Date
- **필수**: ✅ 필수
- **설명**: 코스를 완주한 날짜입니다. 블로그에서 최신순 정렬의 기준이 됩니다.
- **형식**: YYYY-MM-DD (예: 2026-03-15)
- **예시**: 2026년 3월 15일 → `2026-03-15`
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Date`
  3. 타입: `Date`
  4. 각 페이지에서 날짜 선택

---

### 5️⃣ CoverImage (필드명: `CoverImage`)

- **타입**: Files
- **필수**: ❌ 선택
- **설명**: 블로그에 표시될 대표 이미지입니다. Notion 내부 파일 또는 외부 URL 모두 지원합니다.
- **권장사항**:
  - 이미지 크기: 1200×800px 이상
  - 외부 이미지 URL 권장 (Notion 내부 파일은 1시간 후 만료되어 배포 후 깨질 수 있음)
  - Cloudinary, Imgur 등 외부 호스팅 서비스 활용 권장
- **예시**:
  - Notion 업로드: [이미지 파일 선택]
  - 외부 URL: `https://images.unsplash.com/photo-...`
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `CoverImage`
  3. 타입: `Files`
  4. 각 페이지에서 이미지 업로드 또는 웹 클립 추가

---

### 6️⃣ Description (필드명: `Description`)

- **타입**: Rich Text
- **필수**: ❌ 선택
- **설명**: 코스에 대한 짧은 설명입니다. 블로그 카드와 검색 결과에 표시됩니다.
- **권장사항**:
  - 100~200자 정도의 간결한 요약
  - 코스의 특징, 난이도, 주요 볼거리 포함
- **예시**: "강원도 동해 해안선을 따라 걷는 아름다운 트래킹 코스. 해양생물 체험관, 어촌민속박물관 등 문화유산을 감상하며 즐길 수 있습니다."
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Description`
  3. 타입: `Rich Text`
  4. 각 페이지에서 설명 입력

---

### 7️⃣ Distance (필드명: `Distance`)

- **타입**: Number
- **필수**: ❌ 선택
- **설명**: 코스 총 거리입니다. 소수점 1~2자리까지 입력 가능합니다.
- **단위**: km (킬로미터)
- **예시**: 33.5, 42.0, 15.8
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Distance`
  3. 타입: `Number`
  4. Format: 기본값(수동 입력)
  5. 각 페이지에서 숫자 입력

---

### 8️⃣ Duration (필드명: `Duration`)

- **타입**: Number
- **필수**: ❌ 선택
- **설명**: 코스 소요 시간입니다. **분 단위**로 입력합니다.
- **단위**: 분(분) → 블로그에서 "시간:분" 형식으로 자동 변환
- **예시**:
  - 5시간 30분 → `330` (5 × 60 + 30)
  - 2시간 → `120`
  - 4시간 45분 → `285`
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Duration`
  3. 타입: `Number`
  4. Format: 기본값(수동 입력)
  5. 각 페이지에서 분 단위 숫자 입력

---

### 9️⃣ Difficulty (필드명: `Difficulty`)

- **타입**: Select *(단일 선택)*
- **필수**: ❌ 선택
- **설명**: 코스 난이도를 나타냅니다.
- **선택지** (반드시 이 3개만 생성):
  - `쉬움` (색상: 초록색 권장)
  - `보통` (색상: 노란색 권장)
  - `어려움` (색상: 빨간색 권장)
- **예시**: `보통` 선택
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Difficulty`
  3. 타입: `Select`
  4. "Select options" 클릭 → 위의 3개 옵션 모두 추가

---

### 🔟 StartLocation (필드명: `StartLocation`)

- **타입**: Rich Text
- **필수**: ❌ 선택
- **설명**: 코스 시작 지점의 좌표입니다. **JSON 형식**으로 입력해야 합니다.
- **형식**:
  ```json
  {"lat": 위도, "lng": 경도, "name": "장소명"}
  ```
  - `name` 필드는 선택사항 (생략 가능)
- **예시**:
  ```json
  {"lat": 37.75, "lng": 129.10, "name": "강릉 해변"}
  ```
  또는
  ```json
  {"lat": 37.75, "lng": 129.10}
  ```
- **좌표 찾는 방법**:
  1. Google Maps에서 장소 검색
  2. 마커 우클릭 → 좌표 복사
  3. 형식: `위도, 경도` → `{"lat": 위도, "lng": 경도}`로 변환
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `StartLocation`
  3. 타입: `Rich Text`
  4. 각 페이지에서 JSON 형식으로 입력

---

### 1️⃣1️⃣ EndLocation (필드명: `EndLocation`)

- **타입**: Rich Text
- **필수**: ❌ 선택
- **설명**: 코스 종료 지점의 좌표입니다. **JSON 형식**으로 입력해야 합니다.
- **형식**: StartLocation과 동일하게 JSON 형식 사용
- **예시**:
  ```json
  {"lat": 37.50, "lng": 129.00, "name": "삼척 해변"}
  ```
- **설정 방법**: StartLocation과 동일

---

### 1️⃣2️⃣ Published (필드명: `Published`)

- **타입**: Checkbox
- **필수**: ✅ 필수
- **설명**: 페이지를 블로그에 공개할지 여부를 결정합니다.
- **동작**:
  - ✅ 체크됨: 블로그에 공개됨
  - ☐ 체크 해제: 블로그에 숨겨짐 (작성 중인 게시글)
- **예시**: ✅ (체크)
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Published`
  3. 타입: `Checkbox`
  4. 각 페이지에서 체크박스 클릭하여 공개/비공개 설정

---

### 1️⃣3️⃣ Completed (필드명: `Completed`)

- **타입**: Select *(단일 선택)*
- **필수**: ❌ 선택
- **설명**: 코스를 완보(완주)했는지 미완주했는지를 표시합니다.
- **선택지** (반드시 이 2개만 생성):
  - `완보` (색상: 초록색 권장)
  - `미완` (색상: 주황색 권장)
- **예시**: `완보` 선택
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Completed`
  3. 타입: `Select`
  4. "Select options" 클릭 → `완보`, `미완` 두 옵션 추가
  5. 각 페이지에서 해당 상태 선택

---

### 1️⃣4️⃣ Content2 (필드명: `Content2`)

- **타입**: Rich Text
- **필수**: ❌ 선택
- **설명**: 코스를 걸으면서 느낀 리뷰 및 감상문입니다. 마크다운 형식을 지원합니다.
- **형식**: 일반 텍스트 (줄바꿈으로 단락 구분)
- **예시**:
  ```
  이 구간을 걸으면서 가장 기억에 남는 것은 역시 푸른 바다였습니다.
  자연의 위대함을 온몸으로 느낄 수 있었던 하루였습니다.
  다음에는 더 여유롭게 즐기고 싶습니다.
  ```
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Content2`
  3. 타입: `Rich Text`
  4. 각 페이지에서 리뷰 텍스트 입력

---

### 1️⃣5️⃣ Images (필드명: `Images`)

- **타입**: Files
- **필수**: ❌ 선택
- **설명**: 코스의 여러 사진을 첨부합니다. 여러 장 업로드 가능합니다.
- **지원 형식**: JPG, PNG, WebP 등 일반 이미지 형식
- **권장사항**:
  - **외부 URL 사용 권장**: Notion 내부 파일의 경우 1시간 후 URL이 만료될 수 있으므로,
    Unsplash, Cloudinary 등 외부 이미지 호스팅 서비스의 URL을 사용하는 것을 권장합니다.
  - **최대 5장** 정도의 사진을 권장 (갤러리 페이지 성능)
- **예시**: [강릉 해변.jpg], [삼척 해수욕장.jpg], [절벽 풍경.jpg]
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Images`
  3. 타입: `Files & media`
  4. 각 페이지에서 여러 이미지 첨부 또는 외부 URL 링크 추가

---

### 1️⃣6️⃣ Rate (필드명: `Rate`)

- **타입**: Number
- **필수**: ❌ 선택
- **설명**: 코스의 만족도를 1.0~5.0 범위의 별점으로 표시합니다.
- **범위**: 1.0 ~ 5.0 (소수점 1자리)
- **예시**:
  - 5.0 = 최고 만족 (꼭 다시 가고 싶음)
  - 4.5 = 매우 만족 (좋았음)
  - 4.0 = 만족 (무난함)
  - 3.5 = 보통 (그냥저냥)
  - 3.0 이하 = 불만족
- **설정 방법**:
  1. Database에서 "+" 버튼 → 새 속성 추가
  2. 속성명: `Rate`
  3. 타입: `Number`
  4. 소수점 설정: 1자리 (옵션)
  5. 각 페이지에서 별점 입력

---

## 🛠️ 단계별 Notion Database 생성 가이드

### Step 1️⃣: Notion 새 Database 생성

1. **Notion 워크스페이스** 접속
2. 좌측 사이드바에서 **"+ 추가"** 클릭
3. **"Database"** → **"테이블"** 선택
4. Database 이름: `CoursePosts` 또는 원하는 이름 설정
5. ✅ Database 생성 완료

---

### Step 2️⃣: Title 속성 확인 (기본 속성)

Notion Database 생성 시 기본으로 `Title` 속성이 있습니다.
- 이미 있으므로 추가 설정 불필요
- 각 페이지의 제목으로 사용

---

### Step 3️⃣: 필수 속성 추가 (6개)

Database의 첫 행에서 **"+" 버튼** 클릭 → 아래 순서대로 속성 추가:

#### 추가 순서:
1. **Category** (Select)
   - 옵션: 해파랑길, 남파랑길, 서해랑길, DMZ 평화의 길

2. **Slug** (Rich Text)

3. **Date** (Date)

4. **CoverImage** (Files)

5. **Description** (Rich Text)

6. **Published** (Checkbox)

---

### Step 4️⃣: 선택 속성 추가 (5개)

#### 계속해서 "+" 버튼 클릭 → 다음 속성들 추가:

7. **Distance** (Number)

8. **Duration** (Number)

9. **Difficulty** (Select)
   - 옵션: 쉬움, 보통, 어려움

10. **StartLocation** (Rich Text)

11. **EndLocation** (Rich Text)

---

### Step 5️⃣: 첫 번째 페이지 생성 (테스트)

1. Database에서 **"+ 새로 추가"** 또는 첫 행에서 **"+ New"** 클릭
2. 다음 필드 입력 (테스트 목적):

| 필드 | 입력값 | 비고 |
|---|---|---|
| **Title** | 강릉~삼척 구간 | 필수 |
| **Category** | 해파랑길 | 필수 |
| **Slug** | gangneung-samcheok-haebarang | 필수 |
| **Date** | 2026-03-15 | 필수 |
| **Published** | ☑️ | 필수 (체크) |
| **CoverImage** | (선택) 이미지 파일 업로드 | 선택 |
| **Description** | (선택) 강원도 해안선을 따라... | 선택 |
| **Distance** | (선택) 33.5 | 선택 |
| **Duration** | (선택) 330 | 선택 |
| **Difficulty** | (선택) 보통 | 선택 |
| **StartLocation** | (선택) `{"lat":37.75,"lng":129.10}` | 선택 |
| **EndLocation** | (선택) `{"lat":37.50,"lng":129.00}` | 선택 |

3. 페이지 저장

---

## 🔐 Notion API 연동 준비

Notion 데이터베이스가 준비되면, 프로젝트와 연동하기 위해 다음이 필요합니다.

### 1️⃣ Notion Integration 생성

1. **Notion Developers** 접속: https://www.notion.so/my-integrations
2. **"+ New integration"** 클릭
3. Integration 이름: `Korea-Trail-Blog` (또는 원하는 이름)
4. 로고 및 설명 추가 (선택사항)
5. **"Submit"** 클릭
6. **"Internal Integration Token"** 복사 (📋 아이콘 클릭)
   - 이 값이 `.env.local`의 `NOTION_API_TOKEN`이 됩니다.

---

### 2️⃣ Notion Database에 Integration 접근 권한 부여

1. Notion Database 페이지 우상단 **"공유"** 클릭
2. **"초대"** 탭에서 위에서 생성한 Integration 선택 → **"초대"**
3. Integration이 Database에 접근 가능하도록 설정됨

---

### 3️⃣ Database ID 확인

1. Notion Database 페이지 URL 확인:
   ```
   https://www.notion.so/WORKSPACE_NAME/DATABASE_ID?v=...
   ```
   또는
   ```
   https://www.notion.so/DATABASE_ID?v=...
   ```

2. **DATABASE_ID** 부분 복사 (하이픈 포함, 예: `abc123def-456-789-0def-456789...`)
   - 이 값이 `.env.local`의 `NOTION_DATABASE_ID`가 됩니다.

---

### 4️⃣ .env.local 설정

프로젝트 루트의 `.env.local` 파일을 생성/수정:

```env
# Notion API
NOTION_API_TOKEN=ntn_[위에서 복사한 Internal Integration Token]
NOTION_DATABASE_ID=[위에서 확인한 Database ID]

# Google Maps API (선택사항, Phase 5에서 필요)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[Google Cloud에서 발급받은 API 키]
```

**주의**: `.env.local`은 `.gitignore`에 등재되어 있으므로 커밋되지 않습니다. 안전합니다.

---

## ✅ 검증 체크리스트

Database 설정이 완료되었는지 확인하세요:

- [ ] **Title** 속성 확인 (기본 속성)
- [ ] **Category** 속성 생성 (Select, 5개 옵션: 동해안, 남해안, 서해안, DMZ, 지리산)
- [ ] **Slug** 속성 생성 (Rich Text)
- [ ] **Date** 속성 생성 (Date)
- [ ] **CoverImage** 속성 생성 (Files)
- [ ] **Description** 속성 생성 (Rich Text)
- [ ] **Distance** 속성 생성 (Number)
- [ ] **Duration** 속성 생성 (Number)
- [ ] **Difficulty** 속성 생성 (Select, 3개 옵션: 쉬움, 보통, 어려움)
- [ ] **StartLocation** 속성 생성 (Rich Text)
- [ ] **EndLocation** 속성 생성 (Rich Text)
- [ ] **Published** 속성 생성 (Checkbox)
- [ ] 최소 1개 이상의 테스트 페이지 생성
- [ ] Notion Integration 생성 및 Database 접근 권한 부여
- [ ] `NOTION_API_TOKEN` 값 확인
- [ ] `NOTION_DATABASE_ID` 값 확인
- [ ] `.env.local` 파일 생성 및 환경 변수 입력

---

## 🚀 다음 단계

Database 설정이 완료되면:

1. **.env.local 파일 생성**
   ```bash
   cp .env.example .env.local  # 또는 수동으로 파일 생성
   ```

2. **환경 변수 입력**
   - `NOTION_API_TOKEN`
   - `NOTION_DATABASE_ID`

3. **개발 서버 시작**
   ```bash
   npm run dev
   ```

4. **http://localhost:3000** 접속하여 Notion 데이터 확인

---

## 📚 참고 자료

- **Notion API 공식 문서**: https://developers.notion.com/reference
- **Notion Database 속성 타입**: https://www.notion.so/help/database-properties
- **Google Maps API 좌표 찾기**: https://maps.google.com/

---

## 🖼️ 이미지 관리 정책

### Notion 이미지 URL 1시간 만료 문제

Notion 데이터베이스에 업로드한 이미지(CoverImage, Images)는 보안상 1시간 후 URL이 만료됩니다.
이로 인해 배포 후 이미지가 깨지는 문제가 발생할 수 있습니다.

### ✅ 권장 해결 방안 (우선순위)

#### **방안 1: 외부 이미지 호스팅 서비스 사용 (권장)** ⭐⭐⭐

Notion에 업로드하는 대신 **외부 이미지 호스팅 서비스**의 URL을 "링크로 추가"하세요.

**지원 서비스**:
- **Unsplash** (https://unsplash.com) - 무료 고해상도 사진
- **Pexels** (https://pexels.com) - 무료 저작권 없는 이미지
- **Cloudinary** (https://cloudinary.com) - 이미지 최적화 + CDN
- **Imgur** (https://imgur.com) - 간단한 이미지 호스팅
- **AWS S3** - 프로덕션 환경 권장

**설정 방법**:
1. Notion Database에서 CoverImage 또는 Images 필드 클릭
2. "+"  버튼 클릭 → "링크로 추가" 선택
3. 외부 이미지 URL 입력 (예: `https://images.unsplash.com/photo-...`)

**장점**:
- ✅ URL 만료 없음 (장기 안정성)
- ✅ CDN을 통한 빠른 로딩
- ✅ 이미지 최적화 지원 (Cloudinary)
- ✅ 관리 용이

---

#### **방안 2: Notion 웹 클립 (Web Clip)** ⭐⭐

Notion의 "웹 클립" 기능을 사용하여 외부 URL을 추가합니다.

**설정 방법**:
1. Notion Database에서 CoverImage 필드 클릭
2. "+"  버튼 클릭 → "웹 클립" 선택
3. 웹 페이지 URL 입력 → Notion이 자동으로 썸네일 추출

**장점**:
- ✅ URL 만료 없음
- ✅ 자동 썸네일 생성

---

#### **방안 3: 이미지 프록시 Route Handler (미래)** 

현재 구현 중: `/api/image?url=...` Route Handler로 Notion 이미지를 프록시합니다.

**기술 사항**:
- 요청할 때마다 Notion API에서 새 URL 획득
- 프로덕션에서 이미지 깨짐 방지
- 추가 API 호출로 인한 성능 영향 존재

**실제 사용 (Phase 5.5 이후)**:
```typescript
// 현재 방식
<Image src={post.coverImage} />

// 프록시 방식 (미래)
<Image src={`/api/image?url=${encodeURIComponent(post.coverImage)}`} />
```

---

### 📋 이미지 업로드 체크리스트

새로운 코스를 Notion에 추가할 때:

- [ ] **CoverImage**
  - [ ] ✅ 외부 URL 사용 (Unsplash, Cloudinary 등)
  - [ ] ☐ Notion 내부 파일 업로드 (❌ 비권장: 1시간 후 만료)
  - [ ] ☐ 웹 클립으로 추가

- [ ] **Images**
  - [ ] ✅ 외부 URL 또는 웹 클립 사용 (권장)
  - [ ] ☐ Notion 내부 파일 (최대 5장, 단기만 사용)

- [ ] **이미지 명명**
  - [ ] 의미 있는 파일명 사용 (예: `kangneung-coastal-view.jpg`)
  - [ ] 한글 이름 피하기 (URL 인코딩 문제 방지)

---

## ❓ FAQ

### Q: Notion 이미지가 1시간 후 깨지는데 어떻게 해야 하나요?

**A**: Notion 내부 업로드 파일은 1시간 후 만료되는 URL을 반환합니다. 다음 방법으로 대응하세요:

1. **외부 이미지 서비스 사용 (권장)**
   - CoverImage에 Cloudinary, Imgur 등의 외부 URL 입력
   - 예: `https://images.unsplash.com/photo-...`

2. **Notion 웹 클립 (Web Clip)**
   - CoverImage에서 "Link to a web page" 선택 후 이미지 URL 입력

### Q: Slug는 반드시 입력해야 하나요?

**A**: Slug를 입력하지 않으면 **Notion Page ID**가 자동으로 사용됩니다.
- 권장: 사용자 친화적인 슬러그 직접 입력
- 선택: Page ID 자동 사용 가능

### Q: Category나 Difficulty 옵션을 추가하고 싶어요.

**A**: 현재 코드는 다음 4개 카테고리만 인식합니다:
- 해파랑길, 남파랑길, 서해랑길, DMZ 평화의 길

추가 카테고리는 `src/lib/types.ts`의 `TrailCategory` 타입 수정 필요:
```typescript
export type TrailCategory =
  | "해파랑길"
  | "남파랑길"
  | "서해랑길"
  | "DMZ 평화의 길"
  | "새로운카테고리";  // 추가
```

또한 `src/lib/utils.ts`의 `categoryToSlug` 및 `slugToCategory` 함수도 수정해야 합니다:
```typescript
const slugMap: Record<string, string> = {
  해파랑길: "hae-parang-gil",
  남파랑길: "nam-parang-gil",
  서해랑길: "seo-hae-rang-gil",
  "DMZ 평화의 길": "dmz-peace-trail",
  "새로운카테고리": "new-category",  // 추가
};
```

### Q: 기존 Notion Database가 있는데 필드명이 다릅니다.

**A**: `src/lib/notion.ts`의 `mapPageToTrailPost()` 함수에서 필드명 매핑을 변경할 수 있습니다.

예를 들어, `Course Title` 필드를 사용하려면:
```typescript
title: extractPlainText(props["Course Title"]?.title ?? []),
```

---

## 📞 문제 해결

**개발 서버 시작 후 데이터가 표시되지 않는 경우:**

1. `.env.local` 환경 변수 확인
   ```bash
   cat .env.local  # 값이 올바르게 설정되었는지 확인
   ```

2. Notion Database ID 정확성 확인
   - URL에서 올바르게 복사했는지 확인
   - 하이픈 포함 여부 확인

3. Integration 권한 확인
   - Notion Database에서 Integration이 "편집자" 권한으로 추가되었는지 확인

4. 페이지 Published 여부 확인
   - Notion Database에서 모든 페이지의 Published 체크박스가 ☑️로 설정되었는지 확인

5. 개발 서버 재시작
   ```bash
   npm run dev  # 개발 서버 재시작
   ```

---

**Version**: 1.0
**Last Updated**: 2026-03-31
**Related**: ROADMAP.md (Phase 5: API 연동), PRD.md (데이터 모델)
