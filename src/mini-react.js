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