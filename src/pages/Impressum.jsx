export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Impressum</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Anbieter</h2>
          <p className="mb-2"><strong>Work Flow</strong></p>
          <p className="text-gray-600 dark:text-gray-300">Task Management Platform</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Kontakt</h2>
          <p className="text-gray-600 dark:text-gray-300">Email: contact@workflow.app<br />Website: workflow.app</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Verantwortlich für Inhalte</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">Verantwortlich gemäß § 55 Abs. 2 RStV:</p>
          <p className="text-gray-600 dark:text-gray-300"><strong>Work Flow</strong><br />contact@workflow.app</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Haftungsausschluss</h2>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Haftung für Inhalte</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Die Inhalte unserer Seiten wurden mit großer Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Nach §§ 8 bis 10 des TMG sind wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Haftung für Links</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Unsere Website enthält Links zu externen Webseiten Dritter. Für deren Inhalte können wir keine Gewähr übernehmen. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf Rechtsverstöße überprüft.</p>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Online-Streitbeilegung</h2>
          <p className="text-gray-600 dark:text-gray-300">Die Europäische Kommission stellt eine OS-Plattform bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">https://ec.europa.eu/consumers/odr/</a></p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Urheberrecht</h2>
          <p className="text-gray-600 dark:text-gray-300">Die durch die Seitenbetreiber erstellten Inhalte unterliegen dem deutschen Urheberrecht. Downloads sind nur für privaten, nicht kommerziellen Gebrauch gestattet.</p>
        </section>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}</p>
        </div>
      </div>
    </div>
  )
}
