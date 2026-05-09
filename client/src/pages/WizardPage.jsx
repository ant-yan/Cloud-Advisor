import WizardContainer from '../components/wizard/WizardContainer';
import { usePageTitle } from '../hooks/usePageTitle';

export default function WizardPage() {
  usePageTitle('Find Your Cloud');
  return <WizardContainer />;
}
