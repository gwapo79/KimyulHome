import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xn--2i4bq4i58b81e.com'),
  title: {
    default: "서초지율 합동법률사무소 | 부동산, 채무조정, 회생 전문",
    template: "%s | 서초지율"
  },
  description: "부동산 분쟁부터 채무 조정, 개인회생까지. 5,000건 이상의 해결 사례를 보유한 서초지율 합동법률사무소입니다. 24시간 무료상담.",
  keywords: ["서초지율", "부동산전문변호사", "개인회생", "채무조정", "전세사기", "상가임대차", "이혼변호사", "법률상담"],
  openGraph: {
    title: "서초지율 합동법률사무소",
    description: "부동산/채무/회생 통합 법률 솔루션. 당신의 권리를 지켜드립니다.",
    url: 'https://www.xn--2i4bq4i58b81e.com',
    siteName: '서초지율 합동법률사무소',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/assets/images/logo.jpg',
        width: 800,
        height: 600,
        alt: '서초지율 로고',
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "서초지율 합동법률사무소",
  "image": "https://www.xn--2i4bq4i58b81e.com/assets/images/logo.jpg",
  "url": "https://www.xn--2i4bq4i58b81e.com",
  "telephone": "02-6080-3377",
  "email": "sjlaw14@naver.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "서초중앙로24길 3 4층",
    "addressLocality": "Seocho-gu",
    "addressRegion": "Seoul",
    "postalCode": "06634",
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.493,
    "longitude": 127.013
  },
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        ></script>
      </body>
    </html>
  );
}
