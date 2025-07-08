"use client"

import { SERVER_URL } from "@/config";
import { AuthStore } from "@/stores/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loading from "./loading";
import { PlusIcon } from "@heroicons/react/24/outline"
import { useStore } from "@tanstack/react-store";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Palette,
  Search,
  Plus,
  Users,
  Clock,
  MoreHorizontal,
  Globe,
  Lock,
} from "lucide-react";

interface room {
  slug: string,
  roomId: string
}



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

  // const handleCreateRoom = async () => {
  //   if (slug.length <= 0) return;
  //   const res = await axios.post(`${SERVER_URL}room`,
  //     {
  //       slug: slug
  //     },
  //     {
  //       headers: {
  //         token: token
  //       }
  //     }
  //   )
  //   if (res.status == 200) {
  //     setRooms(prevRooms => [...prevRooms, res.data]);
  //   }
  // }

  const [myRoomsSearch, setMyRoomsSearch] = useState("");
  const [publicRoomsSearch, setPublicRoomsSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomType, setRoomType] = useState("public");
  const [roomPassword, setRoomPassword] = useState("");



  // Mock data for my drawing rooms
  const myRooms = [
    {
      id: 1,
      name: "Team Brainstorming",
      description: "Weekly design session for product ideas",
      participants: 5,
      maxParticipants: 10,
      lastActive: "2 minutes ago",
      isActive: true,
      isOwner: true,
    },
    {
      id: 2,
      name: "Art Class Project",
      description: "Collaborative artwork for the gallery exhibition",
      participants: 12,
      maxParticipants: 15,
      lastActive: "1 hour ago",
      isActive: true,
      isOwner: true,
    },
    {
      id: 3,
      name: "Architecture Draft",
      description: "Building floor plan sketches and ideas",
      participants: 3,
      maxParticipants: 8,
      lastActive: "3 hours ago",
      isActive: false,
      isOwner: false,
    },
  ];

  // Mock data for public rooms
  const publicRooms = [
    {
      id: 5,
      name: "Open Canvas",
      description: "Anyone can join and draw together",
      participants: 23,
      maxParticipants: 50,
      lastActive: "1 minute ago",
      isActive: true,
      owner: "Sarah Chen",
      isPublic: true,
    },
    {
      id: 6,
      name: "Digital Art Society",
      description: "Community space for digital artists",
      participants: 8,
      maxParticipants: 20,
      lastActive: "15 minutes ago",
      isActive: true,
      owner: "Alex Rivera",
      isPublic: true,
    },
    {
      id: 7,
      name: "Sketch Playground",
      description: "Practice your sketching skills",
      participants: 4,
      maxParticipants: 15,
      lastActive: "30 minutes ago",
      isActive: false,
      owner: "Mike Johnson",
      isPublic: true,
    },
  ];

  const filteredMyRooms = myRooms.filter((room) =>
    room.name.toLowerCase().includes(myRoomsSearch.toLowerCase()),
  );

  const filteredPublicRooms = publicRooms.filter((room) =>
    room.name.toLowerCase().includes(publicRoomsSearch.toLowerCase()),
  );

  const handleCreateRoom = () => {
    // Handle room creation logic here
    console.log("Creating room:", {
      name: newRoomName,
      type: roomType,
      password: roomType === "private" ? roomPassword : null,
    });
    setIsCreateModalOpen(false);
    setNewRoomName("");
    setRoomType("public");
    setRoomPassword("");
  };



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
            <h1 className="text-3xl font-bold mb-2">Drawing Rooms</h1>
            <p className="text-gray-600">
              Manage your rooms and discover public collaborative spaces
            </p>
          </div>

          {/* My Rooms Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Rooms</h2>
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                    <DialogDescription>
                      Set up your collaborative drawing space. Choose between
                      public and private rooms.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomName">Room Name</Label>
                      <Input
                        id="roomName"
                        placeholder="Enter room name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Room Type</Label>
                      <RadioGroup
                        value={roomType}
                        onValueChange={setRoomType}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label
                            htmlFor="public"
                            className="flex items-center gap-2"
                          >
                            <Globe className="w-4 h-4" />
                            Public - Anyone can join
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label
                            htmlFor="private"
                            className="flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Private - Password required
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {roomType === "private" && (
                      <div className="space-y-2">
                        <Label htmlFor="password">Room Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={roomPassword}
                          onChange={(e) => setRoomPassword(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateRoom}
                      disabled={!newRoomName.trim()}
                    >
                      Create Room
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* My Rooms Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search my rooms..."
                value={myRoomsSearch}
                onChange={(e) => setMyRoomsSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* My Rooms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              {filteredMyRooms.map((room) => (
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
                      <div className="flex gap-2">
                        {room.isOwner && (
                          <Badge variant="secondary" className="text-xs">
                            Owner
                          </Badge>
                        )}
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

            {filteredMyRooms.length === 0 && myRoomsSearch && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                <p className="text-gray-600">
                  Try searching with different keywords.
                </p>
              </div>
            )}
          </div>

          {/* Discover Public Rooms Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Discover Public Rooms</h2>
            </div>

            {/* Public Rooms Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search public rooms..."
                value={publicRoomsSearch}
                onChange={(e) => setPublicRoomsSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Animated Search Results */}
            {publicRoomsSearch && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublicRooms.map((room) => (
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
                            <p className="text-xs text-gray-500 mt-2">
                              Created by {room.owner}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
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

                {filteredPublicRooms.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No public rooms found
                    </h3>
                    <p className="text-gray-600">
                      Try searching with different keywords or check back later.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!publicRoomsSearch && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Discover Public Rooms
                </h3>
                <p className="text-gray-600">
                  Start typing to search for public drawing rooms you can join.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>






    </>
  )
}
