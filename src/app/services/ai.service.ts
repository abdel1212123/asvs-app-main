import { Injectable } from '@angular/core';
import { AsvsItem } from '../models/asvs.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiKey: string = 'TEST-API';

  constructor() { }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async getRecommendations(missingItems: AsvsItem[]): Promise<string> {
    if (this.hasApiKey()) {
      return this.callGeminiApi(missingItems);
    } else {
      return this.mockApiResponse(missingItems);
    }
  }

  private mockApiResponse(missingItems: AsvsItem[]): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        let response = `### Recommendations for Missing Controls (Mocked AI Response)\n\n`;
        const subset = missingItems.slice(0, 3);
        subset.forEach(item => {
          response += `#### ${item.id} - ${item.description}\n`;
          response += `**What to implement:** You need to establish a mechanism to address this specific security verification.\n`;
          response += `**How to do it:** Review the standard framework documentation and configure the necessary middleware or validation checks at your application's entry points.\n`;
          response += `**Best Practices:** Always validate input on the server side and never rely solely on client-side controls.\n\n`;
        });
        if (missingItems.length > 3) {
          response += `\n*... and ${missingItems.length - 3} more items. (Please provide an API key for full AI recommendations).*`
        }
        resolve(response);
      }, 1500);
    });
  }

  private async callGeminiApi(missingItems: AsvsItem[]): Promise<string> {
    // Basic Google Gemini REST API Integration
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;

    const prompt = `
      You are an expert Application Security Engineer.
      The user is building an application but is missing the following OWASP ASVS security measures:
      ${JSON.stringify(missingItems.slice(0, 5), null, 2)}
      
      For each missing measure, provide:
      1. What to implement.
      2. How to do it conceptually.
      3. Best practices to apply.
      
      Keep it professional, well-formatted in Markdown, and actionable. Do not exceed 5 items to keep the response concise.
    `;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error('API Request failed');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || 'No recommendations generated.';

    } catch (error) {
      console.error('Error calling Gemini API', error);
      return 'Error calling AI service. Check API key and network connection.';
    }
  }
}
