import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'
import { stripLocalePrefix } from '@/hooks/useLocalePath'
import { SITE } from '@/data/site'

type SEOProps = {
  titleKey?: string
  descriptionKey?: string
  image?: string
  type?: string
  noindex?: boolean
  titleOverride?: string
  descriptionOverride?: string
}

export function SEO({
  titleKey,
  descriptionKey,
  image = '/og-image.png',
  type = 'website',
  noindex = false,
  titleOverride,
  descriptionOverride,
}: SEOProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { pathname } = useLocation()
  const pathNoLocale = stripLocalePrefix(pathname)
  const title =
    titleOverride ?? (titleKey ? t(titleKey, { defaultValue: titleKey }) : SITE.name)
  const description =
    descriptionOverride ??
    (descriptionKey ? t(descriptionKey, { defaultValue: descriptionKey }) : '')
  const canonicalBase = SITE.url.replace(/\/$/, '')
  const canonical = `${canonicalBase}${pathname}`
  const altEn = `${canonicalBase}/en${pathNoLocale}`
  const altFr = `${canonicalBase}/fr${pathNoLocale}`
  const imageUrl = `${canonicalBase}${image}`

  return (
    <Helmet>
      <title>
        {title} — {SITE.name}
      </title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={altEn} />
      <link rel="alternate" hrefLang="fr" href={altFr} />
      <link rel="alternate" hrefLang="x-default" href={altEn} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
    </Helmet>
  )
}
