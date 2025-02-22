
import { supabase } from "@/integrations/supabase/client";

export async function callOpenRouter(message: string) {
  try {
    const { data, error } = await supabase
      .functions.invoke('get-secret', {
        body: { key: 'OPENROUTER_API_KEY' }
      });

    if (error) {
      throw error;
    }

    if (!data?.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not found');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          { role: 'system', content: 'You are a legal AI assistant helping with document analysis, contract drafting, and legal research.' },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenRouter');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
}
