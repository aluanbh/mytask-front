"use client";

import { KeyboardArrowDown } from '@mui/icons-material';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';

interface ProfileButtonProps {
    userName: string;
    imageURL: string;
}

const ProfileMenu: React.FC<ProfileButtonProps> = ({ userName, imageURL }) => {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [avatarLetter, setAvatarLetter] = useState('');

    const logout = () => {
        localStorage.clear();
        signOut();
        window.location.href = '/auth';
    }

    useEffect(() => {
        if (session && session.user) {
            const name = session.user.name?.split(' ')[0];
            setName(name || '');
            const firstLetter = session.user.name?.charAt(0).toUpperCase();
            setAvatarLetter(firstLetter || '');
        }
    }, [session]);




    return (
        <Popover>
            <PopoverTrigger asChild>

                <button className="py-1 pe-2 ps-6 rounded-full border border-neutral-100 shadow-sm ">
                    <div className="flex justify-between items-center flex-row">
                        <p className="p-1 text-base leading-7  text-gray-600">{name || ''}</p>
                        <div className="rounded-full overflow-hidden ms-2 ">
                            {avatarLetter && (
                                <div
                                    className="bg-primary text-white flex items-center justify-center"
                                    style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                                >
                                    {avatarLetter}
                                </div>
                            )}
                        </div>
                        <KeyboardArrowDown className="text-gray-500 text-base ms-2 me-0" />
                    </div>
                </button>

            </PopoverTrigger>
            <PopoverContent className="w-56 rounded-3xl">
                <div className="grid gap-4">
                    <button onClick={logout} className='text-sm text-start'>Deslogar</button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ProfileMenu;
