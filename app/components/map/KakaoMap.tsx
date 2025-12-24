'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

export default function KakaoMap() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            return;
        }

        window.kakao.maps.load(() => {
            if (!mapRef.current) return;

            const geocoder = new window.kakao.maps.services.Geocoder();
            const address = "서울시 서초구 서초중앙로24길 3";

            geocoder.addressSearch(address, function (this: any, result: any, status: any) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

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
                        content: `<div style="width:150px;text-align:center;padding:6px 0;font-size:12px;">서초지율<br><a href="https://map.kakao.com/link/to/서초지율,${result[0].y},${result[0].x}" style="color:blue" target="_blank">길찾기</a></div>`,
                    });
                    infowindow.open(map, marker);

                    // 컨트롤 추가
                    const zoomControl = new window.kakao.maps.ZoomControl();
                    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                    const mapTypeControl = new window.kakao.maps.MapTypeControl();
                    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
                }
            });
        });
    }, []);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    );
}
