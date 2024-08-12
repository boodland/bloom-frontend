/**
 * @type {import('next').NextConfig}
 */
const runtimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  buildExcludes: ['app-build-manifest.json'],
  disable: process.env.NODE_ENV === 'development',
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Configuration according to Newrelic app router example
// See https://github.com/newrelic/newrelic-node-nextjs?tab=readme-ov-file#example-projects
const nrExternals = require('@newrelic/next/load-externals');

// Configuration according to next-intl app router migration example
// See https://next-intl-docs.vercel.app/examples#app-router-migration
// See https://github.com/amannn/next-intl/tree/main/examples/example-app-router-migration
// Middleware has been hacked due to not being able to use a [locale] segment
const withNextIntl = require('next-intl/plugin')('./i18n/i18n.ts');

module.exports = withNextIntl(
  withBundleAnalyzer(
    withPWA({
      experimental: {
        // Without this setting, the Next.js compilation step will routinely
        // try to import files such as `LICENSE` from the `newrelic` module.
        // See https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages.
        serverComponentsExternalPackages: ['newrelic'],
      },
      // In order for newrelic to effectively instrument a Next.js application,
      // the modules that newrelic supports should not be mangled by webpack. Thus,
      // we need to "externalize" all of the modules that newrelic supports.
      webpack: (config) => {
        nrExternals(config);
        return config;
      },
      reactStrictMode: true,
      publicRuntimeConfig: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_VERCEL_BRANCH_URL: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
        NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
        NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
        NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
        NEXT_PUBLIC_SIMPLYBOOK_WIDGET_URL: process.env.NEXT_PUBLIC_SIMPLYBOOK_WIDGET_URL,
        NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
        NEXT_PUBLIC_HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID,
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
      },
      compiler: {
        emotion: true,
      },
      images: {
        domains: ['a.storyblok.com'],
      },
      // We need to leave this configuration to get pages i18n working
      // Forced to put defaultLocale to a non available value to solve
      // problems when selecting en locale (defautlLocale), it didn't refresh at first
      // This is going to display en in the url
      i18n: {
        locales: ['en', 'es', 'hi', 'fr', 'pt', 'de', 'null'],
        defaultLocale: 'null',
        localeDetection: true,
      },
      async redirects() {
        return [
          {
            source: '/welcome',
            destination: '/courses',
            permanent: false,
          },
          {
            source: '/login',
            destination: '/courses',
            permanent: false,
          },
          {
            source: '/about-our-courses',
            destination: '/courses',
            permanent: false,
          },
          {
            source: '/home',
            destination: '/',
            permanent: false,
          },
        ];
      },
      async rewrites() {
        return [
          {
            source: '/welcome/(b|B)(a|A)(d|D)(o|O)(o|O)',
            destination: '/welcome/badoo',
          },
          {
            source: '/welcome/(b|B)(u|U)(m|M)(b|B)(l|L)(e|E)',
            destination: '/welcome/bumble',
          },
          {
            source: '/welcome/(f|F)(r|R)(u|U)(i|I)(t|T)(z|Z)',
            destination: '/welcome/fruitz',
          },
        ];
      },
    }),
  ),
);
