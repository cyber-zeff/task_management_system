import { PlusIcon } from '@heroicons/react/24/outline';
import { useCurrentSpace } from '@lib/context';
import { useFindManySpaceUser } from '@lib/hooks';
import { Space } from '@prisma/client';
import { useState } from 'react';
import Avatar from './Avatar';
import ManageMembers from './ManageMembers';

function MembersModal({ space, isOpen, onClose }: { space: Space; isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-6 shadow-xl max-h-[85vh] overflow-y-auto">
                <h3 className="font-bold text-base md:text-lg">Manage Members of {space.name}</h3>
                <div className="p-4 mt-4">
                    <ManageMembers space={space} />
                </div>
                <div className="flex justify-end mt-4">
                    <button className="btn btn-outline" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

// Used in SpaceHome to render the modal at root level
export function SpaceMembersModal() {
    const space = useCurrentSpace();
    const [isOpen, setIsOpen] = useState(false);
    if (!space) return null;
    return <MembersModal space={space} isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

export default function SpaceMembers() {
    const space = useCurrentSpace();
    const [isOpen, setIsOpen] = useState(false);

    const { data: members } = useFindManySpaceUser(
        {
            where: { spaceId: space?.id },
            include: { user: true },
            orderBy: { role: 'desc' },
        },
        { disabled: !space }
    );

    if (!space) return null;

    return (
        <div className="flex items-center">
            <button onClick={() => setIsOpen(true)} className="modal-button">
                <PlusIcon className="w-7 h-7 text-black cursor-pointer mr-1" />
            </button>
            {members && (
                <button className="mr-1 cursor-pointer" onClick={() => setIsOpen(true)}>
                    {members?.map((member) => (
                        <Avatar key={member.id} user={member.user} size={24} />
                    ))}
                </button>
            )}
            <MembersModal space={space} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}