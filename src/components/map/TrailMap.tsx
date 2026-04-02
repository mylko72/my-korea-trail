'use client';

import { useCallback, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { GeoPoint } from '@/lib/types';

/** TrailMap 컴포넌트 Props */
interface TrailMapProps {
  /** 코스 시작점 좌표 */
  startLocation?: GeoPoint;
  /** 코스 종료점 좌표 */
  endLocation?: GeoPoint;
  /** 코스명 (마커 title에 사용) */
  title?: string;
}

/** 지도 컨테이너 스타일 (인라인 필수 - GoogleMap API 요구사항) */
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

/** 지도 기본 옵션 */
const mapOptions: google.maps.MapOptions = {
  // 불필요한 UI 요소 최소화
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
};

/** 시작점 마커 아이콘 (파란색) */
const startMarkerIcon = {
  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  scaledSize: { width: 40, height: 40 } as google.maps.Size,
};

/** 종료점 마커 아이콘 (빨간색 - 기본) */
const endMarkerIcon = {
  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  scaledSize: { width: 40, height: 40 } as google.maps.Size,
};

/**
 * TrailMap 컴포넌트
 * Google Maps API를 활용하여 코스 시작점/종료점 마커를 표시합니다.
 *
 * @example
 * <TrailMap
 *   startLocation={{ lat: 37.75, lng: 129.10, name: "강릉 출발" }}
 *   endLocation={{ lat: 37.50, lng: 129.00, name: "삼척 도착" }}
 *   title="강릉~삼척 구간"
 * />
 */
export default function TrailMap({ startLocation, endLocation, title }: TrailMapProps) {
  // 좌표 없을 경우 렌더링 건너뜀
  if (!startLocation && !endLocation) {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  // API 키 미설정 시 안전한 폴백
  if (!apiKey) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-border bg-muted md:h-[400px]">
        <p className="text-sm text-muted-foreground">지도 API 키가 설정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <TrailMapInner
      startLocation={startLocation}
      endLocation={endLocation}
      title={title}
      apiKey={apiKey}
    />
  );
}

/** 내부 구현 컴포넌트 (API 키 존재 확인 후 렌더링) */
function TrailMapInner({
  startLocation,
  endLocation,
  title,
  apiKey,
}: TrailMapProps & { apiKey: string }) {
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Google Maps JS API 로딩
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // 지도 로드 완료 콜백
  const onLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);

    // 시작점과 종료점 모두 있을 경우, 두 마커가 모두 보이도록 bounds 자동 조정
    if (startLocation && endLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: startLocation.lat, lng: startLocation.lng });
      bounds.extend({ lat: endLocation.lat, lng: endLocation.lng });
      map.fitBounds(bounds);
    }
  }, [startLocation, endLocation]);

  // 지도 언마운트 콜백
  const onUnmount = useCallback(() => {
    setMapRef(null);
  }, []);

  // 로딩 에러 처리
  if (loadError) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-border bg-muted md:h-[400px]">
        <p className="text-sm text-muted-foreground">지도를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 로딩 중 스켈레톤
  if (!isLoaded) {
    return (
      <div className="h-[300px] w-full animate-pulse rounded-lg border border-border bg-muted md:h-[400px]" />
    );
  }

  // 지도 중심 좌표: 시작점 우선, 없으면 종료점
  const center = startLocation
    ? { lat: startLocation.lat, lng: startLocation.lng }
    : { lat: endLocation!.lat, lng: endLocation!.lng };

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-border md:h-[400px]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* 시작점 마커 (파란색) */}
        {startLocation && (
          <Marker
            position={{ lat: startLocation.lat, lng: startLocation.lng }}
            title={startLocation.name ? `출발: ${startLocation.name}` : `출발${title ? ` (${title})` : ''}`}
            icon={startMarkerIcon}
          />
        )}

        {/* 종료점 마커 (빨간색) */}
        {endLocation && (
          <Marker
            position={{ lat: endLocation.lat, lng: endLocation.lng }}
            title={endLocation.name ? `도착: ${endLocation.name}` : `도착${title ? ` (${title})` : ''}`}
            icon={endMarkerIcon}
          />
        )}
      </GoogleMap>
    </div>
  );
}
