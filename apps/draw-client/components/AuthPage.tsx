"use client"

export default function AuthPage({ isSignin, onClick }: { 
    isSignin: boolean,
    onClick? : ()=>void
 }) {
    return (
        <div className="w-screen h-screen flex justify-center items-center" >
            <div className="p-6 m-2 bg-white rounded text-black flex flex-col" >
                <div className="pt-2">
                    <input type="text" placeholder="Name" />
                </div>
                <div className="pt-2">
                    <input type="text" placeholder="Email" />
                </div>
                <div className="pt-2">
                    <input type="password" placeholder="Password" />
                </div>
                <div className="pt-2">
                    <button className="bg-red-200 p-2 rounded-xl" onClick={onClick}>{isSignin ? "Sign in" : "Sign up"}</button>
                </div>
            </div>
        </div >
    )
}