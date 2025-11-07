import { NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail } from "@/lib/sendEmail"
import { create } from "@/lib/db"

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  email: z.string().email("Invalid email").max(200),
  message: z.string().min(1, "Message is required").max(5000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ errors }, { status: 400 })
    }

    const { name, email, message } = parsed.data

    const to = process.env.CONTACT_TO || process.env.EMAIL_USER
    if (!to) {
      return NextResponse.json({ error: "Email recipient not configured" }, { status: 500 })
    }

    const subject = `New contact form submission from ${name}`
    const text = `From: ${name} <${email}>

Message:
${message}`
    const html = `
      <div>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
      </div>
    `

    await sendEmail(to, subject, text, html)

    // Persist feedback
    try {
      await create('feedbacks', {
        feedback_id: (global as any).crypto?.randomUUID?.() || require('crypto').randomUUID(),
        name,
        email,
        message,
        created_at: new Date(),
      })
    } catch (e) {
      // non-fatal: email already sent
      console.error('Failed to save feedback:', e)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
