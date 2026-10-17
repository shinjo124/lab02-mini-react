export function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: { nodeValue: String(text), children: [] },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...(props || {}),
      children: children
        .flat(Infinity)
        .filter((c) => c !== null && c !== undefined && c !== false && c !== true)
        .map((c) => (typeof c === 'object' ? c : createTextElement(c))),
    },
  };
}

export function renderToDOM(vNode) {
  const { type, props = {} } = vNode;
  const dom =
    type === 'TEXT_ELEMENT'
      ? document.createTextNode(String(props.nodeValue ?? ''))
      : document.createElement(type);

  if (type !== 'TEXT_ELEMENT') dom.__vnode = vNode;

  for (const [name, value] of Object.entries(props)) {
    if (name === 'children' || name === 'nodeValue' || name === 'key') continue;
    if (name.startsWith('on')) continue;
    if (name === 'className') {
      if (value != null && value !== false) dom.setAttribute('class', String(value));
    } else if (name === 'style' && value && typeof value === 'object') {
      Object.assign(dom.style, value);
    } else if (value != null && value !== false) {
      dom.setAttribute(name, value === true ? '' : String(value));
    }
  }

  for (const child of props.children ?? []) {
    dom.appendChild(renderToDOM(child));
  }

  return dom;
}