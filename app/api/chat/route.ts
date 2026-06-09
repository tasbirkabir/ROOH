import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        choices: [
          {
            message: {
              role: 'assistant',
              content: '⚠️ API Key Error: Please configure your OPENROUTER_API_KEY in a `.env.local` file at the project root to unlock the Nvidia Nemotron Companion. 🌸'
            }
          }
        ]
      });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/google-gemini/antigravity',
        'X-Title': 'ROOH Companion'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      return NextResponse.json({
        choices: [
          {
            message: {
              role: 'assistant',
              content: `⚠️ Failed to fetch response from OpenRouter API: ${response.statusText} (${response.status})`
            }
          }
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API Chat Route Handler Exception:', err);
    return NextResponse.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: `⚠️ Internal server error executing model request: ${err.message || err}`
          }
        }
      ]
    }, { status: 500 });
  }
}
