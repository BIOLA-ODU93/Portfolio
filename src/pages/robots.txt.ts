import type { APIRoute } from 'astro';
import { site } from '../content/site';

/** robots.txt follows site.hideFromSearch: blocked while in progress, open at launch. */
export const GET: APIRoute = () =>
  new Response(
    site.hideFromSearch
      ? 'User-agent: *\nDisallow: /\n'
      : 'User-agent: *\nAllow: /\n',
    { headers: { 'Content-Type': 'text/plain' } },
  );
