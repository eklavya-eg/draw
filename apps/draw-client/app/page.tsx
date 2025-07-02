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
  Shield,
  Sparkles,
} from "lucide-react";

export default function Home() {
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
              DrawTogether
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Collaborative Drawing Made Simple
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              Create, Collaborate,
              <br />
              Draw Together
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join millions of creators in real-time collaborative drawing rooms.
              Sketch ideas, brainstorm concepts, and bring your imagination to
              life with friends and teammates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Drawing Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>-
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-red-400 to-blue-400 rounded-2xl shadow-2xl aspect-video max-w-4xl mx-auto flex items-center justify-center">
              <div className="text-white text-center">
                <Palette className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg opacity-90">
                  Interactive Drawing Canvas Preview
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose DrawTogether?</h2>
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

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Professional Tools</CardTitle>
                <CardDescription>
                  Complete set of drawing tools including brushes, shapes, layers,
                  and advanced color palettes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Private rooms with invite-only access. Your creative work is
                  protected with enterprise-grade security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
                <CardDescription>
                  Smart suggestions, auto-complete shapes, and AI-assisted drawing
                  tools to enhance your creativity.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Creating?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators already using DrawTogether for their
              collaborative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
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
