"use client"

import { SERVER_URL } from "@/config";
import { AuthStore } from "@/stores/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loading from "./loading";
import { PlusIcon } from "@heroicons/react/24/outline"
import { useStore } from "@tanstack/react-store";

export default function Dashboard() {
    const token = useStore(AuthStore, (s) => s.token)
    const router = useRouter();
    const [rooms, setRooms] = useState<room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [slug, setSlug] = useState<string>("");

    const fetchRooms = useCallback(async () => {
        try {
            const res = await axios.get(`${SERVER_URL}rooms`, {
                headers: {
                    token: token
                }
            })
            if (res.status == 200) {
                setRooms(res.data.rooms);
                setLoading(false);
            }
        } catch (e) {
            console.log("error fetching rooms: " + e)
        }
    }, [token])
    useEffect(() => {
        if (!token) {
            router.push("/signin")
            return
        }
        fetchRooms();
    }, [token, router, fetchRooms])

    const handleCreateRoom = async () => {
        if (slug.length <= 0) return;
        const res = await axios.post(`${SERVER_URL}room`,
            {
                slug: slug
            },
            {
                headers: {
                    token: token
                }
            }
        )
        if (res.status == 200) {
            setRooms(prevRooms => [...prevRooms, res.data]);
        }
    }

    return (
        <>
            {loading ? <Loading /> : (
                <div className="flex w-screen h-min-100 h-overflow-auto">
                    {rooms.map((room, index) => (
                        <div className="w-30 h-20 p-4 border-2 rounded-lg cursor-pointer" onClick={() => {
                            router.push(`/canvas/${room.roomId}`)
                        }} key={index}>
                            {room.slug}
                        </div>
                    ))}
                    <div className="flex flex-col w-30 h-20 w-max-30 p-4 border-2 rounded-lg" key={"create new room"}>
                        <button aria-label="create-new-room" className="flex border-2 justify-center border-gray-800 rounded-lg" onClick={handleCreateRoom} >
                            <PlusIcon className='size-6' />
                        </button>
                        <input placeholder="slug" type="text" value={slug} onChange={(e) => {
                            setSlug(e.target.value);
                        }}></input>
                    </div>
                </div>
            )}
        </>
    )
}

interface room {
    slug: string,
    roomId: string
}