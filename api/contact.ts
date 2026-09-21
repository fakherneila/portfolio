import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(20),
  website: z.string().max(0).optional().default(''),
})

const rateLimitMap = new Map<string, number>()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      ?.trim() ?? 'unknown'
  const now = Date.now()
  const lastRequest = rateLimitMap.get(ip) ?? 0

  if (now - lastRequest < 120000) {
    return res.status(429).json({ ok: false, error: 'Too many requests' })
  }
  rateLimitMap.set(ip, now)

  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' })
  }

  const values = parsed.data
  if (values.website) {
    return res.status(200).json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    return res
      .status(500)
      .json({ ok: false, error: 'Missing mail configuration' })
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to,
      cc: process.env.CONTACT_CC_EMAIL || undefined,
      replyTo: values.email,
      subject: `[Portfolio] ${values.subject}`,
      text: [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Subject: ${values.subject}`,
        '',
        'Message:',
        values.message,
      ].join('\n'),
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('[contact-api]', error)
    return res.status(500).json({ ok: false, error: 'Send failed' })
  }
}
