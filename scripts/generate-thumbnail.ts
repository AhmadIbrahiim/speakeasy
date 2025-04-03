const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai")
const { GoogleAIFileManager } = require("@google/generative-ai/server")
const fs = require("node:fs")
const path = require("path")
const mime = require("mime-types")

const apiKey = "<REDACTED_GEMINI_KEY>"
const genAI = new GoogleGenerativeAI(apiKey)
const fileManager = new GoogleAIFileManager(apiKey)

if (!apiKey) {
  console.error("Please set the GEMINI_API_KEY environment variable")
  process.exit(1)
}

if (process.argv.length < 3) {
  console.error("Please provide a title for the thumbnail")
  console.error('Usage: npm run generate-thumbnail "Your Article Title"')
  process.exit(1)
}

const title = process.argv[2]

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["image", "text"],
  responseMimeType: "text/plain",
}

async function generateThumbnail(title: string) {
  const prompt = `Image Creation Prompt
Objective: Design a captivating thumbnail for a blog post.

Title: "${title}"

Imagery Requirements:
- Use images or graphics related to the article theme
- Incorporate modern and professional design elements
- Ensure text is readable and well-contrasted

Layout Specifications:
- Aspect Ratio: 3:2
- Place the website name "perfectgreet.site" at the bottom left corner`

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  })

  const result = await chatSession.sendMessage("Generate the thumbnail as described above")
  const candidates = result.response.candidates

  if (!candidates || candidates.length === 0) {
    throw new Error("No image was generated")
  }

  // Find the first image in the response
  for (const candidate of candidates) {
    for (const part of candidate.content.parts) {
      if (part && "inlineData" in part && part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, "base64")
      }
    }
  }

  throw new Error("No image data found in the response")
}

async function main() {
  try {
    console.log("Generating thumbnail for:", title)
    const thumbnail = await generateThumbnail(title)

    // Save to public/posts directory
    const postsDir = path.join(process.cwd(), "public", "posts")

    // Convert title to kebab case for filename
    const kebabTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const fileName = `${kebabTitle}.png`
    const outputPath = path.join(postsDir, fileName)

    fs.writeFileSync(outputPath, thumbnail)
    console.log(`Thumbnail saved to: ${outputPath}`)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
