import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const PROVIDER_LINKS = [
  { id: 'aws',          name: 'Amazon Web Services' },
  { id: 'gcp',          name: 'Google Cloud Platform' },
  { id: 'azure',        name: 'Microsoft Azure' },
  { id: 'digitalocean', name: 'DigitalOcean' },
  { id: 'vercel',       name: 'Vercel' },
  { id: 'netlify',      name: 'Netlify' },
  { id: 'render',       name: 'Render' },
  { id: 'cloudflare',   name: 'Cloudflare' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/25">
                <Cloud className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[1rem] font-extrabold tracking-tight leading-none select-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Cloud</span>
                <span className="text-slate-900 dark:text-white">Advisor</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Helping non-technical users choose the right cloud provider with AI-powered guidance and plain-English explanations.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/wizard" className="hover:text-primary-500 transition-colors">Cloud Wizard</Link></li>
              <li><Link to="/compare" className="hover:text-primary-500 transition-colors">Compare Providers</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-500 transition-colors">Pricing Estimator</Link></li>
              <li><Link to="/glossary" className="hover:text-primary-500 transition-colors">Cloud Glossary</Link></li>
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Providers</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              {PROVIDER_LINKS.map((p) => (
                <li key={p.id}>
                  <Link to={`/providers/${p.id}`} className="hover:text-primary-500 transition-colors">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} CloudAdvisor. Pricing estimates are approximate. Always verify with official provider documentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
