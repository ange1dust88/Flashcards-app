const API_URL = "https://api.openai.com/v1/chat/completions";

export const fetchChatGPTResponse = async (
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<string> => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!API_KEY) throw new Error("OpenAI API key is not defined");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    throw error;
  }
};
