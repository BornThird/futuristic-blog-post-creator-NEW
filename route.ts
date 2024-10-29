import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    await limiter.check(5, 'CACHE_TOKEN') // 5 requests per minute

    const { url, searchIntent, keywords, wordCount, tone, includeImages } = await req.json()

    // Validate input
    if (!url || !searchIntent || !keywords || !wordCount || !tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Initialize OpenAI API
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)

    // Generate blog post
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You are an SEO expert and content writer. Create a ${wordCount}-word blog post for the URL: ${url}. 
                  The post should be optimized for ${searchIntent} search intent, 
                  focus on the keywords: ${keywords}, 
                  and be written in a ${tone} tone.
                  ${includeImages ? 'Include suggestions for relevant images.' : ''}`
      }],
      max_tokens: 1000,
    })

    const generatedContent = completion.data.choices[0].message?.content

    // Log usage for tracking
    console.log(`Blog post generated for URL: ${url}`)

    return NextResponse.json({ content: generatedContent })
  } catch (error: any) {
    console.error('Error generating blog post:', error)
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 })
  }
}