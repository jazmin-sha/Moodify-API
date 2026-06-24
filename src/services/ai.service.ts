import axios from "axios";

export const analyzeMoodPrompt = async (prompt: string) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "qwen/qwen-2.5-72b-instruct",
      messages: [
        {
          role: "system",
          content: `
Analyze the user's music request.

Return ONLY valid JSON in this exact format:

{
  "mood": "",
  "genre": "",
  "energy": "",
  "tempo": "",
  "playlistTitle": "",
  "searchQuery": ""
}

Rules:
- playlistTitle should be human-friendly and catchy
- searchQuery should be optimized for Spotify song search
- if artist/movie/person name exists, preserve it
- do not return explanations
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  console.log(
    "OPENROUTER:",
    process.env.OPENROUTER_API_KEY ? "FOUND" : "MISSING",
  );
  const content = response.data.choices[0].message.content;

  const cleanedContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid AI response");
  }

  return JSON.parse(jsonMatch[0]);
};

// import axios from "axios";

// export const analyzeMoodPrompt = async (prompt: string) => {
//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "qwen/qwen-2.5-72b-instruct",
//       messages: [
//         {
//           role: "system",
//           content:
//             "Extract music mood, genre, energy, and tempo from the user prompt. Return ONLY valid JSON.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );

//   const content = response.data.choices[0].message.content;

//   const cleanedContent = content

//     .replace(/```json/g, "")

//     .replace(/```/g, "")

//     .trim();

//   const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);

//   if (!jsonMatch) {
//     throw new Error("Invalid AI response");
//   }

//   return JSON.parse(jsonMatch[0]);
// };
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export const analyzeMoodPrompt = async (prompt: string) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
//   });

//   const result = await model.generateContent(`
// Analyze this music request: "${prompt}"

// Return ONLY JSON like this:
// {
//   "mood": "",
//   "genre": "",
//   "energy": "",
//   "tempo": ""
// }
// `);

//   const responseText = result.response.text();

//   return JSON.parse(responseText);
// };
// export const analyzeMoodPrompt = async (prompt: string) => {
//   const lowerPrompt = prompt.toLowerCase();

//   if (lowerPrompt.includes("rain")) {
//     return {
//       mood: "nostalgic",
//       genre: "lofi",
//       energy: "low",
//       tempo: "slow",
//     };
//   }

//   if (lowerPrompt.includes("gym")) {
//     return {
//       mood: "energetic",
//       genre: "edm",
//       energy: "high",
//       tempo: "fast",
//     };
//   }

//   if (lowerPrompt.includes("heartbreak")) {
//     return {
//       mood: "sad",
//       genre: "sad",
//       energy: "low",
//       tempo: "slow",
//     };
//   }

//   if (lowerPrompt.includes("party")) {
//     return {
//       mood: "fun",
//       genre: "dance",
//       energy: "high",
//       tempo: "fast",
//     };
//   }

//   return {
//     mood: "chill",
//     genre: "pop",
//     energy: "medium",
//     tempo: "medium",
//   };
// };
