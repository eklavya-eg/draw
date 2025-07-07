"use client"

import { SERVER_URL } from "@/config";
import { AuthStore } from "@/stores/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loading from "./loading";
import { PlusIcon } from "@heroicons/react/24/outline"
import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Search,
  Plus,
  Users,
  Clock,
  MoreHorizontal,
} from "lucide-react";

interface room {
    slug: string,
    roomId: string
}


 const roomss = [
    {
      id: 1,
      name: "Team Brainstorming",
      description: "Weekly design session for product ideas",
      participants: 5,
      maxParticipants: 10,
      lastActive: "2 minutes ago",
      isActive: true,
    },
    {
      id: 2,
      name: "Art Class Project",
      description: "Collaborative artwork for the gallery exhibition",
      participants: 12,
      maxParticipants: 15,
      lastActive: "1 hour ago",
      isActive: true,
    },
    {
      id: 3,
      name: "Architecture Draft",
      description: "Building floor plan sketches and ideas",
      participants: 3,
      maxParticipants: 8,
      lastActive: "3 hours ago",
      isActive: false,
    },
    {
      id: 4,
      name: "Game Design Workshop",
      description: "Character design and concept art session",
      participants: 7,
      maxParticipants: 12,
      lastActive: "5 hours ago",
      isActive: false,
    },
  ];


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

     const [searchQuery, setSearchQuery] = useState("");
      const filteredRooms = roomss.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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









  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            DrawTogether
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Drawing Rooms</h1>
          <p className="text-gray-600">
            Manage your collaborative drawing spaces and join active sessions
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Room
          </Button>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card
              key={room.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                      {room.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {room.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {room.participants}/{room.maxParticipants}
                    </span>
                  </div>
                  <Badge
                    variant={room.isActive ? "default" : "secondary"}
                    className={
                      room.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : ""
                    }
                  >
                    {room.isActive ? "Active" : "Idle"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Last active {room.lastActive}</span>
                </div>
                <Button
                  className="w-full"
                  variant={room.isActive ? "default" : "outline"}
                >
                  {room.isActive ? "Join Room" : "Enter Room"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-4">
              Try searching with different keywords or create a new room.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Room
            </Button>
          </div>
        )}
      </div>
    </div>







            
        </>
    )
}
