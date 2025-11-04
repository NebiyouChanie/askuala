import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('cv') as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    // Accept only PDFs
    const lowerName = (file.name || '').toLowerCase()
    if (!lowerName.endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are allowed' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'instructors')
    await fs.mkdir(uploadsDir, { recursive: true })

    const ext = '.pdf'
    const fileName = `${crypto.randomUUID()}${ext}`
    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, buffer)

    const publicPath = `/uploads/instructors/${fileName}`
    return NextResponse.json({ success: true, path: publicPath, name: file.name, size: file.size, type: file.type })
  } catch (error) {
    console.error('CV upload error:', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}


