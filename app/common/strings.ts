export default function getString(name: string, language?: string): string | null {
  if (!language) {
    try {
      language = localStorage.getItem('locale') ?? 'en'
    } catch {
      // Return English for the server renders so there's less movement while loading
      const langs = JSON.parse(process.env.LANGS ?? '')
      return langs.en[name]
    }
  }
  // @ts-ignore
  const langs = window.env.LANGS

  // Unknown language provided
  // This shouldn't happen naturally
  if (!langs[language]) language = 'en'

  // @ts-ignore
  // Default to English for incomplete translation files
  const data = langs[language]
  return (data && data[name]) ? data[name] : langs.en[name]
}
