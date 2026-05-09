import Tooltip from './Tooltip';
import { GLOSSARY_TOOLTIPS } from '../../lib/glossaryTooltips';

// Wraps a known technical term with a hover tooltip if a definition exists.
// Falls back to plain children if the term isn't in the glossary map.
export default function TermTooltip({ term, children }) {
  const definition = GLOSSARY_TOOLTIPS[term];
  if (!definition) return <>{children}</>;
  return <Tooltip content={definition}>{children}</Tooltip>;
}
