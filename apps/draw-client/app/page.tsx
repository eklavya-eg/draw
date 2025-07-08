"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Palette,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react";
import { useStore } from "@tanstack/react-store";
import { AuthStore } from "@/stores/auth";


export default function Home() {
  const token = useStore(AuthStore, (s) => s.token)
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              Draw
            </span>
          </div>
          <div className="flex items-center gap-4">
            {token == null ? <> <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
              <Link className="hover:bg-purple-100 transition-transform hover:scale-95 rounded-full" href="/signup">
                <Button>Get Started</Button>
              </Link></> :
              <Link className="hover:bg-red-100 transition-transform hover:scale-95 rounded-full" href="/dashboard">
                <Button>Dashboard <ArrowRight className="text-green-700" strokeWidth={4} /></Button>
              </Link>
            }
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative inline-flex items-center mb-6">
              {/* Gradient glow behind */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-red-500 opacity-60 blur-xl"></div>

              {/* Badge */}
              <div className="inline-flex items-center border border-30 border-red-900 gap-2 bg-white text-red-700 px-4 py-2 rounded-full text-sm font-medium relative">
                <Sparkles className="w-4 h-4" />
                Collaborative Drawing Made Simple
              </div>
            </div>


            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              Create, Collaborate,
              <br />
              Draw
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join millions of creators in real-time collaborative drawing rooms.
              Sketch ideas, brainstorm concepts, and bring your imagination to
              life with friends and teammates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {token == null ?
                <Link className="hover:bg-red-100 transition-transform hover:scale-95 rounded-full" href="/signup">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Drawing Now
                    <ArrowRight className="w-5 h-5 ml-2 text-green-700" strokeWidth={4} />
                  </Button>
                </Link> :
                <Link className="hover:bg-purple-100 transition-transform hover:scale-95 rounded-full" href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Drawing Now
                    <ArrowRight className="w-5 h-5 ml-2 text-green-700" strokeWidth={4} />
                  </Button>
                </Link>}
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="relative bg-white rounded-2xl shadow-2xl aspect-video max-w-4xl mx-auto overflow-hidden flex items-center justify-center">
              {/* Grid background */}
              <div className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
                  backgroundSize: '40px 40px'
                }}
              ></div>

              {/* Flowchart shapes */}
              <div className="absolute z-10 flex flex-col items-center space-y-20">
                {/* Start node */}
                <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md">
                  Start
                </div>

                {/* Process box */}
                <div className="bg-blue-500 text-white px-8 py-4 rounded shadow-md">
                  Process
                </div>

                {/* Decision diamond */}
                <div className="w-32 h-32 bg-yellow-500 transform rotate-45 flex items-center justify-center shadow-md">
                  <span className="transform -rotate-45 text-white font-semibold">Decision</span>
                </div>

                {/* End node */}
                <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md">
                  End
                </div>
              </div>

              {/* Overlay text/icon */}
              <div className="text-black text-center z-10 absolute bottom-8">

              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
          </div>


        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Draw?</h2>
            <p className="text-xl text-gray-600">
              Everything you need for seamless collaborative drawing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Real-time Collaboration</CardTitle>
                <CardDescription>
                  Draw together with unlimited participants. See every stroke in
                  real-time across all devices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized for speed with instant synchronization and minimal
                  latency for smooth drawing experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Anywhere, Anytime</CardTitle>
                <CardDescription>
                  Access your drawing rooms from any device, anywhere in the
                  world. Cross-platform compatibility.
                </CardDescription>
              </CardHeader>
            </Card>

          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Draw
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2025 Draw Eklavya.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
