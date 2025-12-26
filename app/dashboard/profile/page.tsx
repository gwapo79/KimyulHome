
import Link from "next/link";
import { getUserProfile } from "./actions";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
    const user = await getUserProfile();

    return (
        <main className="max-w-7xl mx-auto">
            {/* Navigation Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/dashboard">
                            <span className="text-[#8a765e] hover:text-[#74634e] cursor-pointer">마이페이지</span>
                        </Link>
                    </li>
                    <li><i className="fas fa-chevron-right text-[#d5d6d9] text-xs"></i></li>
                    <li><span aria-current="page" className="text-[#535861]">프로필 설정</span></li>
                </ol>
            </nav>

            <ProfileForm user={user} />
        </main>
    );
}

