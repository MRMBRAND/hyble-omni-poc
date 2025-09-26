export type FetchHelperOptions = {
  expect?: 'json' | 'blob' | 'text' | 'response';
};

export const createApiClient = (
  getAccessTokenSilently: () => Promise<string>,
) => {
  const fetchHelper = async <T>(
    request: Request,
    options?: FetchHelperOptions,
  ): Promise<T> => {
    const token = await getAccessTokenSilently();

    if (token) {
      request.headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`, {
        cause: response.status,
      });
    }

    if (response.status === 204) return {} as T;
    if (options?.expect === 'response') return response as unknown as T;

    const contentType = response.headers
      .get('content-type')
      ?.split(';')[0]
      ?.toLowerCase();

    if (!contentType) {
      const bodyText = await response.text();
      if (!bodyText) return {} as T;
      throw new Error('Unsupported response: missing content-type header');
    }

    if (
      contentType === 'application/pdf' ||
      contentType.startsWith('image/') ||
      contentType === 'application/octet-stream'
    ) {
      return (await response.blob()) as T;
    }

    if (contentType === 'application/json' || contentType.endsWith('+json')) {
      return (await response.json()) as T;
    }

    if (contentType.startsWith('text/')) {
      return (await response.text()) as T;
    }

    throw new Error(`Unsupported content-type: ${contentType}`);
  };

  return { fetchHelper };
};
