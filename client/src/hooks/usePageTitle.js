import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { createElement } from 'react';

const BASE_TITLE = 'CloudAdvisor — Find Your Perfect Cloud';
const BASE_DESC = 'Answer 6 questions and get an AI-powered recommendation across 8 cloud providers — AWS, GCP, Azure, DigitalOcean, Vercel, Netlify, Render, and Cloudflare. Free, no account required.';

export function usePageTitle(title, description) {
  const fullTitle = title ? `${title} — CloudAdvisor` : BASE_TITLE;
  const fullDesc = description || BASE_DESC;

  useEffect(() => {
    document.title = fullTitle;

    // Update OG + Twitter meta tags dynamically
    const metas = {
      'og:title': fullTitle,
      'og:description': fullDesc,
      'twitter:title': fullTitle,
      'twitter:description': fullDesc,
      'description': fullDesc,
    };

    Object.entries(metas).forEach(([key, val]) => {
      const isOg = key.startsWith('og:') || key.startsWith('twitter:');
      const attr = isOg ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    return () => {
      document.title = BASE_TITLE;
    };
  }, [fullTitle, fullDesc]);
}
