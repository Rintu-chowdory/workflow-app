import { useState } from 'react'

export default function Datenschutz() {
  const [expandedSection, setExpandedSection] = useState(0)

  const sections = [
    {
      title: 'Verantwortlicher',
      icon: '👤',
      content: 'WorkflowApp ist verantwortlich für die Datenverarbeitung auf dieser Plattform. Bei Fragen zum Datenschutz kontaktieren Sie uns unter datenschutz@workflowapp.com.'
    },
    {
      title: 'Datenerhebung',
      icon: '📊',
      content: 'Wir erheben und verarbeiten folgende Daten: (1) Benutzerinformationen (Name, E-Mail), (2) Task- und Projektdaten die Sie eingeben, (3) Nutzungsstatistiken und Logs zur Verbesserung unserer Services, (4) Geräteinformationen für technische Unterstützung. Diese Daten werden nur zur Bereitstellung und Verbesserung von WorkflowApp verwendet.'
    },
    {
      title: 'Google OAuth Login',
      icon: '🔐',
      content: 'Zur Authentifizierung verwenden wir Google OAuth. Wir speichern nur Ihre Google-ID und Ihre in Google hinterlegte E-Mail-Adresse. Wir speichern nicht Ihr Google-Passwort. Sie können die Autorisierung jederzeit in Ihren Google-Kontoeinstellungen widerrufen.'
    },
    {
      title: 'Ihre Rechte',
      icon: '⚖️',
      content: 'Nach der DSGVO haben Sie das Recht: (1) auf Auskunft über Ihre gespeicherten Daten, (2) auf Berichtigung fehlerhafter Daten, (3) auf Löschung Ihrer Daten (Recht auf Vergessenwerden), (4) auf Einschränkung der Verarbeitung, (5) auf Datenportabilität. Sie können diese Rechte jederzeit ausüben, indem Sie uns unter datenschutz@workflowapp.com kontaktieren.'
    },
    {
      title: 'Datensicherheit',
      icon: '🔒',
      content: 'Wir schützen Ihre Daten durch: (1) Ende-zu-Ende-Verschlüsselung für sensible Daten, (2) sichere Server-Infrastruktur, (3) regelmäßige Sicherheitsaudits, (4) Beschränkung des Zugriffs auf autorisierte Mitarbeiter. Bei einem Datenschutzverstoß informieren wir Sie unverzüglich.'
    },
    {
      title: 'Kontakt',
      icon: '📧',
      content: 'Für Datenschutzfragen oder um Ihre Rechte auszuüben, kontaktieren Sie: datenschutz@workflowapp.com oder WorkflowApp, Datenschutzbeauftragter, Musterstraße 1, 12345 Musterstadt.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Datenschutzerklärung</h1>
          <p className="text-gray-400">Datenschutz nach DSGVO für WorkflowApp</p>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors"
            >
              <button
                onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                className="w-full p-5 flex items-center gap-4 hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{section.icon} {section.title}</h2>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedSection === idx ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {expandedSection === idx && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-700 bg-gray-800/50">
                  <p className="text-gray-300 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-gray-800/50 border border-gray-700">
          <p className="text-sm text-gray-400">
            Diese Datenschutzerklärung wurde zuletzt aktualisiert am {new Date().toLocaleDateString('de-DE')} und unterliegt der DSGVO (Datenschutz-Grundverordnung).
          </p>
        </div>
      </div>
    </div>
  )
}
