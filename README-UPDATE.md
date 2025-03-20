# Voicemail Greeting Generator - Vercel Blob Integration

## Overview

This update integrates Vercel Blob storage into the Voicemail Greeting Generator application to make it fully compatible with Vercel's serverless environment. Since Vercel's serverless functions cannot write to the local filesystem in production, we've implemented Vercel Blob for storing and retrieving generated audio files.

## Changes Made

1. Added `@vercel/blob` dependency to handle file storage in the cloud
2. Created a `BlobStorageService` to manage file operations with Vercel Blob
3. Modified `voices.ts` to use different storage approaches based on environment:
   - Development: Uses local filesystem (unchanged behavior)
   - Production: Uses Vercel Blob storage
4. Updated the API route to handle both local and Blob storage responses
5. Created environment configuration for the Blob storage token

## Environment Setup

To use this update, you need to set up the following environment variables:

```
BLOB_READ_WRITE_TOKEN=<REDACTED_VERCEL_BLOB_TOKEN>
```

You can add this to your `.env` file locally and to your Vercel project environment variables for production.

## Local Development

For local development, the application will continue to use the local filesystem for storing and retrieving audio files. No change in behavior is expected when running `npm run dev`.

## Production Deployment

In production (when deployed to Vercel), the application will automatically use Vercel Blob storage. This solves the issue of not being able to write to the filesystem in serverless environments.

## Technical Implementation

The implementation uses a dual-path approach:

1. In development:

   - Files are written to and read from the local `output/` directory
   - FFmpeg processes files locally as before

2. In production:
   - Files are uploaded to and downloaded from Vercel Blob
   - FFmpeg processing happens in `/tmp` directory (which is writable in serverless functions)
   - Final output is stored in Vercel Blob for retrieval

This approach ensures compatibility with Vercel's serverless environment while maintaining the same functionality as before.
