import { createElement } from '../mini-react.js';
import { useState } from '../reactive-engine.js';

function describeItem(item) {
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  return String(item?.title ?? item?.name ?? JSON.stringify(item));
}

export function DataFeed({ fetchFeed } = {}) {
  const [state, setState] = useState({ status: 'IDLE' });

  const loadData = async () => {
    setState({ status: 'LOADING' });

    try {
      if (typeof fetchFeed !== 'function') {
        throw new Error('The feed loader is not configured.');
      }
      const data = await fetchFeed();
      setState({ status: 'SUCCESS', data });
    } catch (error) {
      setState({
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unable to load the feed.',
      });
    }
  };

  let content;
  if (state.status === 'IDLE') {
    content = createElement(
      'button',
      { type: 'button', onClick: loadData },
      'Load feed',
    );
  } else if (state.status === 'LOADING') {
    content = createElement(
      'section',
      { 'aria-busy': 'true', 'aria-label': 'Loading feed' },
      createElement('p', { role: 'status' }, 'Loading feed...'),
      [1, 2, 3].map((key) =>
        createElement('span', {
          className: 'data-feed__skeleton',
          'aria-hidden': 'true',
          key,
        }),
      ),
    );
  } else if (state.status === 'SUCCESS') {
    const items = Array.isArray(state.data) ? state.data : [state.data];
    content = createElement(
      'ul',
      null,
      items.map((item, index) =>
        createElement('li', { key: item?.id ?? index }, describeItem(item)),
      ),
    );
  } else {
    content = createElement(
      'section',
      null,
      createElement('p', { role: 'alert' }, state.error),
      createElement(
        'button',
        { type: 'button', onClick: loadData },
        'Retry Connection',
      ),
    );
  }

  return createElement(
    'section',
    { className: 'data-feed' },
    createElement('h2', null, 'Data Feed'),
    content,
  );
}

