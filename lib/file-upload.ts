import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest } from 'next/server'

export async function uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', folder)
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${fileExtension}`
    
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Return the public URL path
    return `/${folder}/${filename}`
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

export function validateFile(file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  // Check file size (maxSize in bytes)
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    }
  }

  return { valid: true }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const { unlink } = await import('fs/promises')
    const { join } = await import('path')
    
    // Remove leading slash and join with public directory
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath
    const fullPath = join(process.cwd(), 'public', cleanPath)
    
    await unlink(fullPath)
  } catch (error) {
    console.error('Error deleting file:', error)
    // Don't throw error for file deletion failures
  }
}
