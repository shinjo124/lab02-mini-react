# AI Failure Audit

I checked the chat prompts against the code and Git history. The listener and key examples below are real project code. I could not find an `innerHTML` version in the history, so that first bad snippet is an example of what could have gone wrong, not something I can claim the AI actually wrote.

## 1. Rendering text with `innerHTML`

**Prompt:** “Replace `src/main.js` with the test from the slide” (Ex1).

**Bad code example:** This is a reconstructed example; it does not appear in the project history.

```js
root.innerHTML = `<p>${message}</p>`;
```

**Risk:** The browser treats the string as HTML. If `message` contains markup or an event attribute, it could create an element or run injected code.

**How I checked:** In the Ex1 page, DevTools shows `<img onerror=alert(1)> Safe Text` as plain text, and there is no `img` element. The renderer uses `document.createTextNode`. I also searched Git history for `innerHTML` and found no implementation.

**Fix:** Turn strings into text nodes and append them to the DOM. The current renderer already does this.

## 2. Adding listeners to every rendered element

**Prompt:** “Add `renderToDOM` to `src/mini-react.js`.”

**Bad code (from commit `a57ae31`):**

```js
if (name.startsWith('on')) {
  if (typeof value === 'function') {
    dom.addEventListener(name.slice(2).toLowerCase(), value);
  }
  continue;
}
```

The renderer attached an event listener to each matching element while building the page.

**Risk:** Every button or input gets its own listener. Since the app rebuilds the rendered tree after state changes, it repeats this work on every render.

**How I caught it:** The Git history shows this code in `a57ae31`, then shows it removed when event delegation was added in `2c8e14e`. In DevTools, the task buttons had no listeners; the app root had the delegated `click`, `input`, and `keydown` listeners.

**Fix:** Keep the handlers on the VNodes and let the event delegation hub look them up from the root. `renderApp` sets up those root listeners once, outside its render function.

## 3. Falling back to the array index for a key

**Prompt:** “ex 3 Create `src/data-feed.js`.”

**Bad code (from commit `5804e0f`, still in the file):**

```js
items.map((item, index) =>
  createElement('li', { key: item?.id ?? index }, describeItem(item)),
)
```

**Risk:** If an item has no `id`, its key becomes its current position in the list. After an insertion, removal, or reorder, a future reconciler could reuse the wrong item's DOM or state. The current renderer rebuilds the whole tree and does not reconcile by key, so this is a future risk rather than a bug we can see in the current UI. The sample feed items all have IDs.

**How I noticed it:** The `?? index` fallback is visible in the code from commit `5804e0f`. The current renderer ignores `key` as a DOM attribute and has no keyed reconciliation, so DevTools does not show a warning for it.

**Fix:** Require each feed item to have a stable ID, or validate and normalize the data before rendering it. Use that ID for the key instead of quietly falling back to the array position.
