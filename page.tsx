'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Loader2, Link, Search, ShoppingCart, Image as ImageIcon, Wand2, Key, Shield } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function FuturisticBlogBuilder() {
  const [url, setUrl] = useState('')
  const [searchIntent, setSearchIntent] = useState('')
  const [keywords, setKeywords] = useState('')
  const [wordCount, setWordCount] = useState(500)
  const [tone, setTone] = useState('')
  const [includeImages, setIncludeImages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [animationProgress, setAnimationProgress] = useState(0)
  const [error, setError] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setAnimationProgress((prev) => (prev + 1) % 101)
      }, 50)
      return () => clearInterval(interval)
    } else {
      setAnimationProgress(0)
    }
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedContent('')
    setError('')

    if (!openaiKey) {
      setError('Please enter your OpenAI API key')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/generate-blog-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          url,
          searchIntent,
          keywords,
          wordCount,
          tone,
          includeImages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      toast({
        title: "Blog post generated!",
        description: "Your SEO-optimized blog post has been created successfully.",
      })
    } catch (err: any) {
      setError(err.message || 'Error generating content. Please try again.')
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to generate blog post. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 mb-8">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Futuristic SEO Blog Post Builder
          </h1>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              Your API key is sent securely to our server and is not stored. Never share your API key publicly.
            </AlertDescription>
          </Alert>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="openaiKey" className="text-gray-300 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                OpenAI API Key
              </Label>
              <Input
                id="openaiKey"
                type="password"
                placeholder="Enter your OpenAI API key"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="relative">
              <Input
                id="url"
                placeholder="Enter target URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="searchIntent" className="text-gray-300">Search Intent</Label>
                <Select value={searchIntent} onValueChange={setSearchIntent} required>
                  <SelectTrigger id="searchIntent" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select search intent" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="informational" className="text-white">
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-2 text-blue-400" />
                        Informational
                      </div>
                    </SelectItem>
                    <SelectItem value="navigational" className="text-white">
                      <div className="flex items-center">
                        <Link className="w-4 h-4 mr-2 text-green-400" />
                        Navigational
                      </div>
                    </SelectItem>
                    <SelectItem value="transactional" className="text-white">
                      <div className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2 text-purple-400" />
                        Transactional
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tone" className="text-gray-300">Writing Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select writing tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="informative" className="text-white">Informative</SelectItem>
                    <SelectItem value="persuasive" className="text-white">Persuasive</SelectItem>
                    <SelectItem value="friendly" className="text-white">Friendly</SelectItem>
                    <SelectItem value="professional" className="text-white">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="keywords" className="text-gray-300">Focus Keywords</Label>
              <Input
                id="keywords"
                placeholder="Enter comma-separated keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="wordCount" className="text-gray-300">Word Count: {wordCount}</Label>
              <Slider
                id="wordCount"
                min={100}
                max={2000}
                step={100}
                value={[wordCount]}
                onValueChange={(value) => setWordCount(value[0])}
                className="my-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="includeImages"
                checked={includeImages}
                onCheckedChange={setIncludeImages}
              />
              <Label htmlFor="includeImages" className="text-gray-300">Include relevant images</Label>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content... {animationProgress}%
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Futuristic Blog Post
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {generatedContent && (
        <Card className="w-full max-w-4xl mx-auto mt-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Generated Blog Post</h2>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
              <div className="prose prose-invert max-w-none">
                {generatedContent.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent)
                toast({
                  title: "Copied to clipboard",
                  description: "The generated blog post has been copied to your clipboard.",
                })
              }}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}