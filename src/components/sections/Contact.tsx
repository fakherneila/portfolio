import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { SITE, SOCIALS } from '@/data/site'
import { contactSchema, type ContactFormValues } from '@/lib/schemas'
import {
  Badge,
  Button,
  Card,
  FormField,
  Icon,
  Reveal,
  Section,
  SectionHeading,
} from '@/components/ui'

type SubmitStatus = 'idle' | 'success' | 'error'

export function Contact() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  })
  const errorText = (message?: string) =>
    message ? t(message, { defaultValue: message }) : undefined
  const onSubmit = async (values: ContactFormValues) => {
    setStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Send failed')
      setStatus('success')
      reset()
    } catch (err) {
      console.error('[contact]', err)
      setStatus('error')
    }
  }

  return (
    <Section id="contact" py="lg">
      <SectionHeading
        eyebrow={t('contact.subtitle')}
        titleKey="contact.title"
      />
      {SITE.availability.available ? (
        <Reveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <Badge variant="success" pulse>
              {t('contact.availability.available')} —{' '}
              {t('contact.availability.range')}
            </Badge>
          </div>
        </Reveal>
      ) : null}
      <Reveal delay={0.2}>
        <div className="mx-auto mt-12 max-w-2xl">
          <Card className="p-6 md:p-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('website')}
                />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  label={t('contact.form.name')}
                  name="name"
                  placeholder={t('contact.form.placeholders.name')}
                  register={register('name')}
                  error={errorText(errors.name?.message)}
                />
                <FormField
                  label={t('contact.form.email')}
                  name="email"
                  type="email"
                  placeholder={t('contact.form.placeholders.email')}
                  register={register('email')}
                  error={errorText(errors.email?.message)}
                />
              </div>
              <FormField
                label={t('contact.form.subject')}
                name="subject"
                placeholder={t('contact.form.placeholders.subject')}
                register={register('subject')}
                error={errorText(errors.subject?.message)}
              />
              <FormField
                label={t('contact.form.message')}
                name="message"
                type="textarea"
                rows={6}
                placeholder={t('contact.form.placeholders.message')}
                register={register('message')}
                error={errorText(errors.message?.message)}
              />
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  loading={isSubmitting}
                  icon={isSubmitting ? undefined : 'Send'}
                >
                  {isSubmitting
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
                </Button>
              </div>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-2 pt-2 text-sm text-green-500"
                  >
                    <Icon name="CheckCircle2" size={16} />
                    {t('contact.form.success')}
                  </motion.p>
                ) : null}
                {status === 'error' ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: [0, -6, 6, -3, 3, 0] }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 pt-2 text-sm text-red-500"
                  >
                    <Icon name="AlertCircle" size={16} />
                    {t('contact.form.error')}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </form>
          </Card>
        </div>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-muted">{t('contact.orReachMe')}</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  social.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                aria-label={t(`contact.socials.${social.label.toLowerCase()}`, {
                  defaultValue: social.label,
                })}
                className="rounded-full border border-border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold"
              >
                <Icon name={social.icon} size={20} />
              </a>
            ))}
          </div>
          <div className="mt-6 text-center text-sm text-muted space-y-1">
            <p>
              <span className="text-gold/70">
                {t('contact.emailsLabel.personal')}:
              </span>{' '}
              <a
                href={`mailto:${SITE.emails.primary}`}
                className="hover:text-gold transition-colors"
              >
                {SITE.emails.primary}
              </a>
            </p>
            <p>
              <span className="text-gold/70">
                {t('contact.emailsLabel.professional')}:
              </span>{' '}
              <a
                href={`mailto:${SITE.emails.professional}`}
                className="hover:text-gold transition-colors"
              >
                {SITE.emails.professional}
              </a>
            </p>
          </div>
          <div className="mt-4 text-center text-sm text-muted space-y-1">
            {SITE.phones.map((phone) => (
              <p key={phone.raw}>
                <span className="text-gold/70">
                  {t('contact.phonesLabel', 'Phone')}:
                </span>{' '}
                <a
                  href={`tel:${phone.raw}`}
                  className="hover:text-gold transition-colors"
                >
                  {phone.number}
                </a>
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
