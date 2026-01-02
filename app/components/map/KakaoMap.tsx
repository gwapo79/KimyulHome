'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

export default function KakaoMap() {
    const mapRef = useRef<HTMLDivElement>(null);

    // ⚠️ API 키는 추후 제가 직접 입력합니다.
    const KAKAO_API_KEY = 'c28e6cb53181ed8e85261a60165b5686';

    useEffect(() => {
        // 1. 스크립트가 이미 있는지 확인
        if (!document.getElementById('kakao-map-script')) {
            const script = document.createElement('script');
            script.id = 'kakao-map-script';
            // libraries=services 추가: 주소 검색(Geocoder) 등 라이브러리 사용을 위해 필요
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
            script.async = true;

            script.onload = () => {
                window.kakao.maps.load(initMap);
            };

            document.head.appendChild(script);
        } else {
            // 이미 스크립트가 있으면 로드 후 실행
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(initMap);
            }
        }

        function initMap() {
            if (!mapRef.current) return;

            // 실제 사무실 좌표 상수 (서초지율)
            const OFFICE_LAT = 37.493032;
            const OFFICE_LNG = 127.013837;

            // 디버깅: services 라이브러리 로드 확인
            if (!window.kakao.maps.services) {
                // 더 이상 에러로 로그 남기지 않음 (의도된 하드코딩 모드)
                const defaultCoords = new window.kakao.maps.LatLng(OFFICE_LAT, OFFICE_LNG);
                renderMap(defaultCoords);
                return;
            }

            // 로직 최적화: Geocoder 없이 바로 좌표로 렌더링 (에러 방지)
            const coords = new window.kakao.maps.LatLng(OFFICE_LAT, OFFICE_LNG);
            renderMap(coords);

            function renderMap(coords: any) {
                if (!mapRef.current) return;

                const option = {
                    center: coords,
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapRef.current, option);

                // 마커 생성
                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: coords,
                });

                // 인포윈도우 생성
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="width:150px;text-align:center;padding:6px 0;font-size:12px;">서초지율<br><a href="https://map.kakao.com/link/to/서초지율,${coords.getLat()},${coords.getLng()}" style="color:blue" target="_blank">길찾기</a></div>`,
                });
                infowindow.open(map, marker);

                // 컨트롤 추가
                const zoomControl = new window.kakao.maps.ZoomControl();
                map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                const mapTypeControl = new window.kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
            }
        }
    }, []);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    );
}
