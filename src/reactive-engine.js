import { renderToDOM } from './mini-react.js';

let stateStore = [];
let cursor = 0;
let triggerRender = () => {};

export function setRenderer(rerenderFn) {
  triggerRender = rerenderFn;
}

export function resetCursor() {
  cursor = 0;
}

export function useState(initialValue) {
  const currentCursor = cursor;

  if (stateStore[currentCursor] === undefined) {
    stateStore[currentCursor] = initialValue;
  }

  const setState = (nextValue) => {
    const previousValue = stateStore[currentCursor];
    const resolvedValue =
      typeof nextValue === 'function' ? nextValue(previousValue) : nextValue;

    if (!Object.is(previousValue, resolvedValue)) {
      stateStore[currentCursor] = resolvedValue;
      triggerRender();
    }
  };

  cursor += 1;
  return [stateStore[currentCursor], setState];
}

export function setupEventDelegation(rootContainer) {
  for (const eventType of ['click', 'input', 'keydown']) {
    rootContainer.addEventListener(eventType, (nativeEvent) => {
      const handlerProp = `on${eventType[0].toUpperCase()}${eventType.slice(1)}`;
      let target = nativeEvent.target;

      while (target && target !== rootContainer) {
        const handler = target.__vnode?.props?.[handlerProp];
        if (typeof handler === 'function') {
          handler(nativeEvent);
          break;
        }
        target = target.parentElement ?? target.parentNode;
      }
    });
  }
}

export function renderApp(App, rootContainer) {
  const render = () => {
    resetCursor();
    rootContainer.replaceChildren(renderToDOM(App()));
  };

  setRenderer(render);
  setupEventDelegation(rootContainer);
  render();
}
