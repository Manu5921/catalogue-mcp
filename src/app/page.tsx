/**
 * 🏠 HOME PAGE - CATALOGUE MCP
 * 
 * Page d'accueil moderne du catalogue universel MCP
 */

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🔌</div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Universal MCP Server Catalogue
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover, monitor, and connect to Model Context Protocol servers. 
            Built for Claude Code integration with real-time health monitoring.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/catalogue">
              <Button size="lg" className="text-lg px-8 py-3">
                🔍 Browse Catalogue
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              📖 Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-3xl mb-4">🔍</div>
              <CardTitle>Automatic Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically discovers MCP servers running on your system with real-time connection testing.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-3xl mb-4">🏥</div>
              <CardTitle>Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Continuous health checks with uptime tracking, response time monitoring, and alerting system.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-3xl mb-4">🤖</div>
              <CardTitle>Claude Code Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamless integration with Claude Code for enhanced development workflows and AI assistance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Build Status */}
        <Card className="bg-green-50 border-green-200 mb-16">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold text-lg">Build Successful</span>
            </div>
            <div className="space-y-2 text-green-700">
              <p>✅ Phase E3 - Environment validation completed successfully</p>
              <p>✅ Phase E4 - Tests First architecture implemented</p>
              <p>🚀 Phase E5 - Implementation in progress</p>
            </div>
          </CardContent>
        </Card>

        {/* Known Servers Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Known MCP Servers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <CardTitle className="text-lg">Context7</CardTitle>
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Documentation and code examples for popular libraries and frameworks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛠️</span>
                    <CardTitle className="text-lg">Serena</CardTitle>
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced code analysis, symbol manipulation, and project memory management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <CardTitle className="text-lg">Archon</CardTitle>
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Project management, task tracking, and RAG-powered knowledge base.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="text-center p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to explore MCP servers?</h2>
            <p className="text-xl opacity-90 mb-8">
              Start discovering and monitoring Model Context Protocol servers in your development environment.
            </p>
            <Link href="/catalogue">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Started →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}