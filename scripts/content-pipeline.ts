import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

interface Topic {
  title: string
  relevanceScore: number
  description: string
  keywords: string[]
}

interface BlogPost {
  title: string
  date: string
  image: string
  description: string
  content: string
}

class ContentPipeline {
  private readonly POSTS_DIR = "src/posts"
  private readonly PUBLIC_POSTS_DIR = "public/posts"
  private readonly TOPICS_TO_GENERATE = 10

  constructor(private apiKey: string) {
    this.ensureDirectoriesExist()
  }

  private ensureDirectoriesExist() {
    ;[this.POSTS_DIR, this.PUBLIC_POSTS_DIR].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  private async searchTopics(query: string): Promise<Topic[]> {
    // This would integrate with a real API (e.g., Google Trends, SEMrush, etc.)
    try {
      const response = await axios.get(`https://api.example.com/topics`, {
        params: {
          q: query,
          key: this.apiKey,
        },
      })

      return response.data.topics.map((topic: any) => ({
        title: topic.title,
        relevanceScore: this.calculateRelevanceScore(topic),
        description: topic.description,
        keywords: topic.keywords,
      }))
    } catch (error) {
      console.error("Error searching topics:", error)
      return []
    }
  }

  private calculateRelevanceScore(topic: any): number {
    // Implement your relevance scoring logic here
    // Consider factors like:
    // - Relation to voicemail/greeting services
    // - Current trends
    // - Search volume
    // - Competition
    return 0 // Placeholder
  }

  private async generateContent(topic: Topic): Promise<BlogPost> {
    const date = new Date().toISOString().split("T")[0]
    const fileName = this.generateFileName(topic.title)

    const post: BlogPost = {
      title: topic.title,
      date,
      image: `/posts/${fileName}.png`,
      description: topic.description,
      content: this.generatePostContent(topic),
    }

    return post
  }

  private generateFileName(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  private generatePostContent(topic: Topic): string {
    // Template based on our established blog post structure
    return `## Problem Statement

${topic.description}

## Solution Overview

[Generated solution overview based on topic]

## Key Points

### 1. [First Key Point]
- Point detail 1
- Point detail 2
- Point detail 3

### 2. [Second Key Point]
- Point detail 1
- Point detail 2
- Point detail 3

## Implementation Guide

1. **First Step**
   - Sub-point 1
   - Sub-point 2
   - Sub-point 3

2. **Second Step**
   - Sub-point 1
   - Sub-point 2
   - Sub-point 3

## Best Practices

- Best practice 1
- Best practice 2
- Best practice 3
- Best practice 4
- Best practice 5

## Common Mistakes to Avoid

1. [First mistake]
2. [Second mistake]
3. [Third mistake]
4. [Fourth mistake]
5. [Fifth mistake]

## Measuring Success

Track these metrics:
- Metric 1
- Metric 2
- Metric 3
- Metric 4

## Conclusion

Ready to improve your business communication? Visit [Perfect Greet](https://perfectgreet.site) to create professional voicemail greetings that enhance your brand image.`
  }

  private async generateThumbnail(fileName: string, title: string): Promise<void> {
    try {
      await execAsync(`npm run generate-thumbnail "${title}"`)
      console.log(`Generated thumbnail for: ${title}`)
    } catch (error) {
      console.error(`Error generating thumbnail for ${title}:`, error)
    }
  }

  private async savePost(post: BlogPost, fileName: string): Promise<void> {
    const filePath = path.join(this.POSTS_DIR, `${fileName}.md`)
    const content = `---
title: "${post.title}"
date: "${post.date}"
image: "${post.image}"
description: "${post.description}"
---

${post.content}`

    fs.writeFileSync(filePath, content)
    console.log(`Saved post: ${filePath}`)
  }

  public async run(searchQuery: string): Promise<void> {
    try {
      // 1. Search for topics
      console.log("Searching for topics...")
      const topics = await this.searchTopics(searchQuery)

      // 2. Filter and sort by relevance
      const relevantTopics = topics.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, this.TOPICS_TO_GENERATE)

      // 3. Generate content for each topic
      for (const topic of relevantTopics) {
        console.log(`Generating content for: ${topic.title}`)
        const post = await this.generateContent(topic)
        const fileName = this.generateFileName(topic.title)

        // 4. Save the post
        await this.savePost(post, fileName)

        // 5. Generate thumbnail
        await this.generateThumbnail(fileName, topic.title)
      }

      console.log("Content pipeline completed successfully!")
    } catch (error) {
      console.error("Error in content pipeline:", error)
    }
  }
}

// Usage example:
const API_KEY = process.env.CONTENT_API_KEY
if (!API_KEY) {
  console.error("Please set CONTENT_API_KEY environment variable")
  process.exit(1)
}

const pipeline = new ContentPipeline(API_KEY)
pipeline.run("business communication voicemail trends 2024").catch(console.error)
