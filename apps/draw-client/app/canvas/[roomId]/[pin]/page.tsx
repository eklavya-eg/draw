import CanvasClient from "@/components/CanvasClient";

export default async function PrivateCanvas({ params }:
    {params: {
        roomId: string,
        pin: string
     }}) {

    const roomId = (await params).roomId;
    const pin = (await params).pin;
    console.log(roomId)
    return(
        <div>
            <CanvasClient roomId={roomId} pin={pin} ></CanvasClient>
        </div>
    )
}