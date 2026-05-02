import { useCountList } from '@lib/hooks';
import { Space } from '@prisma/client';
import Link from 'next/link';

type Props = {
    spaces: Space[];
};

function SpaceItem({ space }: { space: Space }) {
    const { data: listCount } = useCountList({
        where: { spaceId: space.id },
    });
    return (
        <div className="w-full h-full flex relative justify-center items-center bg-[#EC683E] hover:bg-[#e6653e] text-[#fff] rounded-[25px]">
            <div className="badge badge-outline badge-sm absolute top-4 right-4">{listCount}</div>
            <Link href={`/space/${space.slug}`}>
                <div className="card-body" title={`${space.name} ${listCount ? ': ' + listCount + ' lists' : ''}`}>
                    <h2 className="card-title line-clamp-1">{space.name}</h2>
                </div>
            </Link>
        </div>
    );
}

export default function Spaces({ spaces }: Props) {
    return (
        <ul className="flex flex-wrap gap-4">
            {spaces?.map((space) => (
                <li
                    className="card w-80 h-32 flex justify-center shadow-xl cursor-pointer bg-[#EC683E]"
                    key={space.id}
                >
                    <SpaceItem space={space} />
                </li>
            ))}
        </ul>
    );
}
