'use client';

import Image from "next/image";
import { useActionState, useEffect, useState, useRef } from "react";
import { updateUserProfile, updateAvatar } from "./actions";
import Toast from "@/app/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import AddressSearchModal from "@/app/components/ui/AddressSearchModal";

// Note: In a real app, these should be env vars. Check your Supabase project settings.
// Now using @/lib/supabase singleton.


// If keys are missing, we will have limited functionality.

const initialState = {
    success: false,
    message: '',
};

interface ProfileFormProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        avatarUrl: string | null;
    } | null;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(updateUserProfile, initialState);
    const [showToast, setShowToast] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "/assets/images/profiles/default_profile.png");
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null); // To manually set value if needed

    useEffect(() => {
        if (state.message) {
            setShowToast(true);
        }
    }, [state]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            alert("파일 크기는 5MB 이하여야 합니다.");
            return;
        }

        try {
            // 1. Upload to Supabase Storage
            // Using singleton client

            // Note: Singleton throws if keys missing, handled by boundary or global error if not caught?
            // Here we are in try/catch.

            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id || 'unknown'}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // 3. Update DB
            await updateAvatar(publicUrl);
            setAvatarUrl(publicUrl);
            setShowToast(true); // Re-use toast or state for this?
            // Manually showing success for avatar
            // We could also refine the Toast component to handle ad-hoc messages too, but for now we rely on the form state or just alert.
            // Let's rely on visual feedback (image change).

        } catch (error) {
            console.error("Avatar upload failed:", error);
            alert("이미지 업로드에 실패했습니다. (Storage 설정 확인 필요)");
        }
    };

    const handleAddressComplete = (data: any) => {
        // data.fullAddress contains the formatted address from our Modal
        // We can either set state if we had it, or manipulate the DOM input directly since we are using uncontrolled inputs with defaultValue.
        // Or better, let's use a ref to set the value so it submits with FormData.
        if (addressInputRef.current) {
            addressInputRef.current.value = data.fullAddress;
        }
    };

    if (!user) {
        return <div>로그인이 필요합니다.</div>;
    }

    // Split address if stored as combined string
    const [addr1, addr2] = (user.address || '').split(' ').reduce((acc, curr, idx, arr) => {
        // Simple heuristic: if it looks like a road address (ends with '로', '길' etc) put in first part?
        // Actually simplest is just put everything in first or try to split by some delimiter if we enforced it.
        // For now, let's just put full address in first field or split by first space if we want.
        // Let's assumes address is "MainAddr DetailAddr"
        if (idx === 0) acc[0] = curr;
        else acc[1] = (acc[1] ? acc[1] + ' ' : '') + curr;
        return acc;
    }, ['', '']);


    return (
        <div className="bg-white rounded-2xl border border-[#e9e9eb]">
            <Toast
                message={state.message}
                type={state.success ? 'success' : 'error'}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <AddressSearchModal
                isOpen={isAddressOpen}
                onClose={() => setIsAddressOpen(false)}
                onComplete={handleAddressComplete}
            />

            <div className="p-6 lg:p-8 border-b border-[#e9e9eb]">
                <h1 className="text-2xl font-bold text-[#181d27]">내 프로필</h1>
                <p className="text-[#535861] mt-1">정확한 정보가 빠른 상담에 도움이 됩니다.</p>
            </div>

            <form action={formAction} className="space-y-8 p-6 lg:p-8">
                {/* Avatar Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-[#374151]">프로필 이미지</label>
                        <p className="text-sm text-[#535861]">이 사진이 프로필에 표시됩니다.</p>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden relative cursor-pointer group" onClick={handleAvatarClick}>
                            <Image
                                src={avatarUrl}
                                alt="프로필 이미지"
                                fill
                                className="object-cover transition-opacity group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                                <i className="fas fa-camera text-white opacity-0 group-hover:opacity-100"></i>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg"
                            className="hidden"
                        />
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={async () => {
                                try {
                                    await updateAvatar(null);
                                    setAvatarUrl("/assets/images/profiles/default_profile.png");
                                    // Optional: Show success toast
                                } catch (e) {
                                    console.error("Failed to delete avatar", e);
                                    alert("프로필 이미지 삭제 실패");
                                }
                            }} className="px-4 py-2 text-sm font-medium text-[#414651] bg-white border border-[#d5d6d9] rounded-lg shadow-sm hover:bg-neutral-50">삭제</button>
                            <button type="button" onClick={handleAvatarClick} className="px-4 py-2 text-sm font-medium text-white bg-[#8a765e] border border-transparent rounded-lg shadow-sm hover:bg-[#74634e]">변경</button>
                        </div>
                    </div>
                    <div className="md:col-start-2 md:col-span-2">
                        <p className="text-xs text-[#717680]">JPG 또는 PNG 형식, 최대 5MB</p>
                    </div>
                </div>

                <hr className="border-t border-[#e9e9eb]" />

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label htmlFor="name" className="block text-sm font-medium text-[#374151] md:col-span-1">이름 <span className="text-[#8a765e]">*</span></label>
                    <div className="md:col-span-2">
                        <input type="text" name="name" id="name" defaultValue={user.name || ''} required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label htmlFor="contact" className="block text-sm font-medium text-[#374151] md:col-span-1">연락처 <span className="text-[#8a765e]">*</span></label>
                    <div className="md:col-span-2">
                        <input type="tel" name="phone" id="contact" defaultValue={user.phone || ''} required className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label htmlFor="email" className="block text-sm font-medium text-[#374151] md:col-span-1">이메일</label>
                    <div className="md:col-span-2">
                        <input type="email" name="email" id="email" defaultValue={user.email || ''} readOnly className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                    </div>
                </div>

                <hr className="border-t border-[#e9e9eb]" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <label className="block text-sm font-medium text-[#374151] md:col-span-1">주소</label>
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                name="address"
                                id="address1"
                                placeholder="주소"
                                defaultValue={user?.address || ''}
                                ref={addressInputRef}
                                className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e] flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => setIsAddressOpen(true)}
                                className="px-4 py-2.5 text-sm font-medium text-[#414651] bg-white border border-[#d5d6d9] rounded-lg shadow-sm hover:bg-neutral-50 whitespace-nowrap"
                            >
                                주소 검색
                            </button>
                        </div>
                        <input type="text" name="addressDetail" id="address2" placeholder="상세 주소 (선택)" className="w-full px-4 py-3 border border-[#d5d6d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:border-[#8a765e]" />
                    </div>
                </div>

                <div className="pt-6 border-t border-[#e9e9eb] flex justify-end items-center gap-3">
                    <button type="button" className="px-[18px] py-2.5 bg-white rounded-lg shadow-sm border border-[#d5d6d9] text-[#414651] text-base font-medium hover:bg-neutral-50">취소</button>
                    <button type="submit" disabled={isPending} className="px-[18px] py-2.5 bg-[#8a765e] rounded-lg shadow-sm text-white text-base font-medium hover:bg-[#74634e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                        {isPending ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i> 저장 중...
                            </>
                        ) : '저장'}
                    </button>
                </div>
            </form>
        </div>
    );
}
