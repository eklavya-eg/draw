import { WS_URL } from "@/config";
import { AuthStore } from "@/stores/auth";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";

export function useSocket() {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const token = useStore(AuthStore, (s) => s.token);
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            setLoading(false);
        }
        ws.onclose = () => {
            setLoading(true);
            setSocket(null);
        }
        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [token])
    return {
        socket,
        loading
    }
}