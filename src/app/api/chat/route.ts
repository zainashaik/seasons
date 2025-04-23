import { NextRequest, NextResponse } from 'next/server';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || '';
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || '';

async function searchBrave(query: string) {
  try {
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Brave search failed');
    }

    const data = await response.json();
    // Extract and process the first 5 results, now including URLs
    const searchResults = data.web.results.slice(0, 5).map((result: any) => ({
      title: result.title,
      description: result.description,
      url: result.url
    }));

    return {
      context: searchResults.map((r: { title: any; description: any; }) => `${r.title}\n${r.description}`).join('\n\n'),
      links: searchResults // Return the full results including URLs
    };
  } catch (error) {
    console.error('Brave search error:', error);
    return {
      context: '',
      links: []
    };
  }
}

// Add a GET method to test the route
export async function GET() {
  return NextResponse.json({ message: 'API is working' });
}

export async function POST(req: NextRequest) {
  //console.log('API route hit'); // Add logging

  try {
    const body = await req.json();
    //console.log('Received body:', body); // Add logging
    const { userMessage, season } = body;

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    //console.log('Sending message to Mistral:', userMessage); // Debug log

    // Get search results for the outfit
    const { context: searchContext, links } = await searchBrave(
      `${userMessage} outfit improvement ideas`
    );

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `You are a sustainable fashion stylist chatbot specializing in ${season} outfits that provides cute outfit suggestions. The user will describe an outfit and you will provide 3 ideas on how to make it cuter!
            
                    When giving advice, consider:
                    - ${season}-specific weather conditions
                    - Seasonal colors and patterns
                    - Layering appropriate for ${season}
                    - Seasonal accessories
                    - Sustainable fashion choices
                    - your own knowledge and the search results: ${searchContext}

                    Format each suggestion exactly like this, with each suggestion on a new line:
                    • [emoji] First suggestion
                    • [emoji] Second suggestion
                    • [emoji] Third suggestion

                    Example:
                    • 🎀 Add a red bow belt to cinch the waist and accentuate the red heels.
                    • 🐚 Layer a white, off-the-shoulder crop top underneath for a playful touch.
                    • 🌹 Wear a red flower crown to match your heels and add a cute, whimsical element.

                    Choose a relevant emoji. Do not use the same emoji for multiple suggestions in the same response. If you can't find a relevant emoji, use one that contains the same color as the suggested item.
                    Make sure to start each suggestion on a new line.
                    Keep each suggestion concise, creative, specific, relevant to the user's outfit, and include a relevant emoji.`
          },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 200,
        stop: ["4.", "4)", "4-"], // Stop if it tries to add a 4th suggestion
        temperature: 0.7 // Add some creativity while keeping responses focused
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API Error:', errorText); // Debug log
      return NextResponse.json(
        { error: `Mistral API Error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const botReply = data.choices[0]?.message?.content || 'No response from Mistral.';

    return NextResponse.json({ botReply });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
