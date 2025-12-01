import 'dotenv/config';

export async function handler(event, context) {
  try {
    // Get API key from Environmental Variables
    const apiKey = process.env.OPENAI_API_KEY;

    // Parse request from client
    const body = JSON.parse(event.body);
    const inputValue = body.inputValue;

    // Send request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: inputValue,
        max_output_tokens: 500,
      }),
    });

    const data = await response.json();
    // console.log('DEBUG raw data:', data);

    const messageItem = data.output.find((o) => o.type === 'message');
    let text = '(no response)';

    if (messageItem && Array.isArray(messageItem.content)) {
      text = messageItem.content
        .map((c) => c.text)
        .filter(Boolean)
        .join('\n')
        .trim();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ chatResponse: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
