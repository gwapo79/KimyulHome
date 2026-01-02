"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@/data/mock_users";
import { User, Check, ChevronsUpDown } from "lucide-react";

interface AssigneeSelectorProps {
    roleFilter: UserRole[]; // Which roles to show? e.g. ['LAWYER'] or ['STAFF', 'LAWYER']
    currentAssigneeId?: string | null;
    onAssign: (userId: string | null) => void;
    label?: string;
    className?: string;
}

export default function AssigneeSelector({
    roleFilter,
    currentAssigneeId,
    onAssign,
    label = "담당자",
    className = "",
}: AssigneeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [assignee, setAssignee] = useState(currentAssigneeId);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/admin/team')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMembers(data);
                }
            })
            .catch(err => console.error("Failed to load team", err));
    }, []);

    // Filter team members based on roleFilter
    // Note: API returns 'role' in uppercase. Profile roles are LAWYER, STAFF, PROFESSIONAL, USER, etc.
    const candidates = members.filter((member) => roleFilter.includes(member.role));
    const currentMember = members.find((m) => m.id === assignee);

    const handleSelect = (id: string | null) => {
        setAssignee(id);
        onAssign(id);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {label && <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white transition-colors ${isOpen ? "border-[#8a765e] ring-1 ring-[#8a765e]" : "border-slate-200 hover:border-slate-300"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        {currentMember ? (
                            <>
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                                    {currentMember.avatarUrl ? (
                                        <img src={currentMember.avatarUrl} alt={currentMember.name} className="w-full h-full object-cover" />
                                    ) : (
                                        currentMember.name[0]
                                    )}
                                </div>
                                <span className="text-slate-700 font-medium">{currentMember.name} {currentMember.position}</span>
                            </>
                        ) : (
                            <span className="text-slate-400">미지정 (Unassigned)</span>
                        )}
                    </div>
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-1 space-y-0.5">
                            {/* Unassign Option */}
                            <button
                                onClick={() => handleSelect(null)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${!assignee ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                </div>
                                <span>미지정으로 변경</span>
                                {!assignee && <Check className="w-3 h-3 ml-auto text-slate-500" />}
                            </button>

                            <div className="h-px bg-slate-100 my-1" />

                            {candidates.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => handleSelect(member.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${assignee === member.id ? 'bg-[#fffbf6] text-[#8a765e]' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden ${assignee === member.id ? 'bg-[#8a765e] text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {member.avatarUrl ? (
                                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            member.name[0]
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start leading-none gap-0.5">
                                        <span className="font-medium">{member.name}</span>
                                        <span className="text-[10px] text-slate-400">{member.position}</span>
                                    </div>
                                    {assignee === member.id && <Check className="w-3 h-3 ml-auto text-[#8a765e]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay to close */}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
        </div>
    );
}
