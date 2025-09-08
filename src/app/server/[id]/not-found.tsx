/**
 * 🚫 SERVER NOT FOUND PAGE
 * 
 * Page 404 pour serveurs MCP non trouvés
 */

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ServerNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">MCP Server Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The MCP server you're looking for doesn't exist or is no longer available.
          </p>
          
          <div className="space-y-4 mb-8">
            <p className="text-sm text-muted-foreground">This could happen if:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• The server was removed from the catalogue</li>
              <li>• The server ID is incorrect</li>
              <li>• The server is temporarily unavailable</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogue">
              <Button size="lg">
                🔍 Browse All Servers
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                🏠 Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}