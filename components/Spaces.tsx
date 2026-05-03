import { useCountList } from '@lib/hooks';
import { Space } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { useFindManySpaceUser } from '@lib/hooks';
import Avatar from './Avatar';

type Props = {
    spaces: Space[];
};

function SpaceItem({ space, index }: { space: Space; index: number }) {
    const { data: members } = useFindManySpaceUser(
        {
            where: {
                spaceId: space?.id,
            },
            include: {
                user: true,
            },
            orderBy: {
                role: 'desc',
            },
        },
        { disabled: !space }
    );

    const { data: listCount } = useCountList({
        where: { spaceId: space.id },
    });
    const colors = [
        "bg-[#F2995E]", // orange
        "bg-[#7FB2FF]", // blue
        "bg-[#AFA3FF]"  // purple
    ];

    const hoverColors = [
        "hover:bg-[#e68a4f]",
        "hover:bg-[#6aa3f5]",
        "hover:bg-[#9b8df5]"
    ];

    const color = colors[index % colors.length];
    const hover = hoverColors[index % hoverColors.length];

    return (
        <div className={`w-full h-full flex flex-col justify-between relative ${color} ${hover} text-black rounded-[25px] p-4`}>

            <Link href={`/space/${space.slug}`} className='flex justify-between items-center '>
                <div
                    className="card-body p-0"
                    title={`${space.name} ${listCount ? ': ' + listCount + ' lists' : ''}`}
                >
                    <h2 className="card-title line-clamp-0 text-[20px] w-[70%] text-left">{space.name}</h2>
                </div>
                <div>
                    <Image src="/arrow.svg" alt="arrow-icon" width={25} height={25} className='mr-4' />
                </div>
            </Link>

            <div className="flex justify-between">
                <div>
                    {listCount} {listCount == 1 ? "List" : "Lists"}
                </div>
                <div>
                    {members && (
                        <label className="mr-1 modal-button cursor-pointer" htmlFor="management-modal">
                            {members?.map((member) => (
                                <Avatar key={member.id} user={member.user} size={24} />
                            ))}
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Spaces({ spaces }: Props) {
    return (
        <ul className="flex flex-wrap gap-4">
            {spaces?.map((space, index) => (
                <li
                    className="card w-80 h-32 flex justify-start shadow-xl cursor-pointer rounded-[25px] border border-black"
                    key={space.id}
                >
                    <SpaceItem space={space} index={index} />
                </li>
            ))}
        </ul>
    );
}
