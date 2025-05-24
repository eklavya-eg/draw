import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: string[],
    id: string
}){

    const [chats, setChats] = useState<string[]>(messages);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const {socket, loading} = useSocket();
    
    useEffect(()=>{
        if(socket && !loading){
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));
            socket.onmessage = (event)=>{
                const parsedData = JSON.parse(event.data);
                if(parsedData.type=="chat"){
                    setChats(c=> [...c, parsedData.message]);
                }
            };
        }
    }, [socket, loading, id]);
    
    return(
        <div>
            {chats.map(m => <div>{m}</div>)}

            <input type="text" aria-label="chat-input" value={currentMessage} onChange={(e)=>{
                setCurrentMessage(e.target.value)
            }} />
            <button onClick={()=>{
                socket?.send(JSON.stringify({
                    type: "chat",
                    message: currentMessage
                }))
            }}>Send</button>
        </div>
    )
}