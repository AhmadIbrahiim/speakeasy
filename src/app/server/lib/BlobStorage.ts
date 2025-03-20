import { put, del, list } from "@vercel/blob"

/**
 * Service for managing audio files using Vercel Blob storage
 * instead of local file system which doesn't work in serverless environments.
 */
class BlobStorageService {
  /**
   * Uploads an audio buffer to Vercel Blob storage
   * @param fileId Unique identifier for the file
   * @param audioBuffer The audio data buffer to store
   * @param suffix Optional suffix to identify file type (e.g., 'bg', 'original')
   * @returns The URL of the stored blob
   */
  public static async uploadAudio(fileId: string, audioBuffer: Buffer, suffix: string = ""): Promise<string> {
    const fileName = suffix ? `${fileId}-${suffix}.mp3` : `${fileId}.mp3`
    const contentType = "audio/mpeg"

    try {
      console.log(`Uploading file ${fileName} with size: ${audioBuffer.byteLength} bytes`)

      // Create a Blob from the Buffer which is compatible with the put function
      // The Blob constructor is available in Node.js environments through the global object
      const blob = new Blob([audioBuffer], { type: contentType })

      // The put function from @vercel/blob handles the upload
      const { url } = await put(`audio/${fileName}`, blob, {
        access: "public",
        contentType: contentType,
        addRandomSuffix: false,
      })

      console.log(`Successfully uploaded file to ${url}`)
      return url
    } catch (error) {
      console.error("Error uploading to Vercel Blob:", error)
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error details:", error.message)
        console.error("Error stack:", error.stack)
      }
      throw error
    }
  }

  /**
   * Downloads an audio file from Vercel Blob storage
   * @param url The URL of the blob to fetch
   * @returns The audio buffer
   */
  public static async downloadAudio(url: string): Promise<Buffer> {
    try {
      // Use explicit headers to ensure proper fetch
      const headers = new Headers({
        Accept: "audio/mpeg",
        "x-content-length": "1", // This dummy header is needed for Vercel Blob
      })

      console.log(`Downloading file from ${url}`)
      const response = await fetch(url, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      console.log(`Successfully downloaded file, size: ${arrayBuffer.byteLength} bytes`)
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error("Error downloading from Vercel Blob:", error)
      if (error instanceof Error) {
        console.error("Error details:", error.message)
      }
      throw error
    }
  }

  /**
   * Deletes a file from Vercel Blob storage
   * @param url The URL of the blob to delete
   */
  public static async deleteAudio(url: string): Promise<void> {
    try {
      await del(url)
      console.log(`Deleted file ${url}`)
    } catch (error) {
      console.error("Error deleting from Vercel Blob:", error)
      throw error
    }
  }

  /**
   * Lists all audio files in storage
   * @returns Array of file URLs
   */
  public static async listAudioFiles(): Promise<string[]> {
    try {
      const { blobs } = await list({ prefix: "audio/" })
      return blobs.map((blob: any) => blob.url)
    } catch (error) {
      console.error("Error listing files from Vercel Blob:", error)
      throw error
    }
  }
}

export default BlobStorageService
