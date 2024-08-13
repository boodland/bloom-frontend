/* import { getStoryblokApi, ISbStoriesParams, ISbStoryData } from '@storyblok/react';
import { getLocale } from 'next-intl/server';
import { locales } from '../../../i18n/config';
import { getStoryblokPageProps } from '../../../utils/getStoryblokPageProps';
import Welcome from './welcome';

export const revalidate = 3600;

export default async function Page({ params }: { params: { partnerName: string } }) {
  const preview = false;
  const locale = await getLocale();
  const partnerName = params?.partnerName;
  const storyblokProps = await getStoryblokPageProps(`welcome/${partnerName}`, locale, preview);
  return <Welcome story={storyblokProps?.story}></Welcome>;
}

export async function generateStaticParams() {
  console.log('GENERATE STATIC');
  let sbParams: ISbStoriesParams = {
    published: true,
    starts_with: 'welcome/',
  };

  const storyblokApi = getStoryblokApi();
  let data = await storyblokApi.getAll('cdn/links', sbParams);

  let paths: any = [];

  data.forEach((story: Partial<ISbStoryData>) => {
    if (!story.slug) return;

    // get array for slug because of catch all
    let splittedSlug = story.slug.split('/');

    if (locales) {
      // create additional languages
      for (const locale of locales) {
        paths.push({ partnerName: splittedSlug[1], locale });
      }
    }
  });

  return paths;
} */

export default async function Page({ params }: { params: { partnerName: string } }) {
  return <h1>PARTNER NAME {params.partnerName}</h1>;
}
