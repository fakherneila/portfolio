import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'contact.form.errors.nameMin'),
  email: z.string().email('contact.form.errors.emailInvalid'),
  subject: z.string().min(3, 'contact.form.errors.subjectMin'),
  message: z.string().min(20, 'contact.form.errors.messageMin'),
  website: z.string().max(0).optional().default(''),
})

export type ContactFormValues = z.infer<typeof contactSchema>
