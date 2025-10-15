import 'dotenv/config';

export async function handler(event, context) {
  try {
    // Get API key from Environmental Variables
    const apiKey = process.env.OPENAI_API_KEY;

    // Parse request from client
    const body = JSON.parse(event.body);
    const inputValue = body.inputValue;

    // Send request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [{ role: 'user', content: inputValue }],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const chatResponse = data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ chatResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
