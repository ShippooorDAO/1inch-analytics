import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';

export const renderStatic = async (html: string) => {
  if (html === undefined) {
    throw new Error('did you forget to return html from renderToString?');
  }

  const cache = createCache({ key: 'css' });
  const { extractCritical } = createEmotionServer(cache);
  const { ids, css } = extractCritical(html);

  return { html, ids, css };
};
