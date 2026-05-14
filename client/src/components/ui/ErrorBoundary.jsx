import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import { withTranslation } from 'react-i18next';

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[CloudAdvisor] Uncaught error:', error, info.componentStack);
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-slate-950">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t('error.title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-7 max-w-sm text-sm leading-relaxed">
            {t('error.message')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {t('error.refresh')}
            </button>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              {t('error.goHome')}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundaryClass);
