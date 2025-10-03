import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, validateFile } from '@/lib/file-upload'

// POST /api/tutors/upload-cv - Upload CV file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('cv') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file, ['application/pdf'], 5 * 1024 * 1024) // 5MB max
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Upload file
    const filePath = await uploadFile(file, 'uploads/cvs')

    return NextResponse.json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        filePath,
        fileName: file.name,
        fileSize: file.size
      }
    })

  } catch (error) {
    console.error('Error uploading CV:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload CV' },
      { status: 500 }
    )
  }
}
