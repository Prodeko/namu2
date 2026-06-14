# Modal flows

A small system for building floating modal flows that can be opened from
anywhere — a button, an effect, or the response of an API call. A flow is one
or more **pages**; each page has an optional title/subtitle, a content block,
and a row of action buttons. The shell renders as a centered card on
tablet/desktop and a full-width bottom sheet on mobile, and animates between
pages with a horizontal slide.

## Quick start

### 1. Provider (one-time)

The modal provider is already mounted at the app root, so nothing is required
per-feature. Modals can be opened from any client component.

### 2. Define a flow

A flow is declared with `createModalFlow`. It returns a handle you later open.
Cross-page state is just `useState` in the flow body, passed down to your
content.

```tsx
const ConfirmFlow = createModalFlow<{ name: string }, boolean>(({ name }) => (
  <Modal showProgress>
    <Modal.Page title="Are you sure?" subtitle={`This removes ${name}.`}>
      <p>This action cannot be undone.</p>
      <Modal.Actions>
        <Modal.CloseButton text="Cancel" intent="tertiary" />
        <Modal.ActionButton text="Delete" onClick={(nav) => nav.resolve(true)} />
      </Modal.Actions>
    </Modal.Page>
  </Modal>
));
```

The two type parameters are the **input props** and the **resolve value**.

### 3. Open it

`showModal` returns a promise that resolves with the value passed to
`nav.resolve(...)`, or `undefined` if the user dismisses the modal.

```tsx
// From a click handler
const confirmed = await showModal(ConfirmFlow, { name: "Item #5" });
if (confirmed) doDelete();

// As the result of an API call — no trigger element needed
await saveDraft();
showModal(ConfirmFlow, { name: "Draft" });
```

## Pages

Pages render in declaration order. Give a page an `id` to jump to it directly
(useful for an error/success branch); otherwise navigation is positional.
Keep every page declared in the tree and branch with `goTo` rather than
conditionally rendering pages, so indices stay stable.

```tsx
<Modal showProgress>
  <Modal.Page id="form" title="Details">…</Modal.Page>
  <Modal.Page id="working" title="Saving" dismissible={false}>…</Modal.Page>
  <Modal.Page id="done" title="All set">…</Modal.Page>
</Modal>
```

## Navigation

Both action buttons and page content can drive navigation through the `useModalNav`
hook. Content can advance itself — for example, kick off an async task in an
effect and call `next()` (or `goTo`) when it finishes.

```tsx
const nav = useModalNav<boolean>();
useEffect(() => {
  doWork().then((ok) => (ok ? nav.next() : nav.goTo("error")));
}, []);
```

## Action buttons

Place buttons inside `Modal.Actions` at the bottom of a page. Four kinds map to
the supported actions:

- `Modal.NextButton` — advance one page (supports a guard, see below)
- `Modal.BackButton` — go back one page
- `Modal.CloseButton` — close the modal (resolves to `undefined`)
- `Modal.ActionButton` — custom handler; receives the navigation surface

A page may have zero action buttons (e.g. a page that auto-advances).

## Behavior notes

- **Dismissibility** is per page. Setting a page as non-dismissible disables the
  close (X) button **and** outside-click **and** the Escape key — use it to lock
  the modal during an in-flight operation.
- **Resolving**: dismissing in any way resolves the open call to `undefined`;
  call `resolve(value)` for a real result. Resolving or closing also hides the
  modal.
- **Step indicator**: opt in at the modal level; it reflects the active page.
- **Presentation** and **slide transitions** are automatic; you don't configure
  them per flow.

## Attribute reference

### `createModalFlow<TProps, TResult>(render)`

| Type param | Meaning |
| --- | --- |
| `TProps` | Object passed in when opening the flow |
| `TResult` | Type returned by the open call when resolved |

### `showModal(flow, props?)`

| Argument | Meaning |
| --- | --- |
| `flow` | A handle returned by `createModalFlow` |
| `props` | Input props for the flow (typed as `TProps`) |
| _returns_ | `Promise<TResult \| undefined>` (`undefined` on dismiss) |

### `Modal`

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `showProgress` | `boolean` | `false` | Show the modal-level step indicator |
| `children` | pages | — | One or more `Modal.Page` elements |

### `Modal.Page`

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | — | Optional page title |
| `subtitle` | `string` | — | Optional page subtitle |
| `id` | `string` | — | Stable name for `goTo(id)` navigation |
| `dismissible` | `boolean` | `true` | When `false`, disables X, outside-click and Escape |
| `children` | content + actions | — | Content block, plus an optional `Modal.Actions` |

### `Modal.Actions`

Container for the bottom button row. Accepts any number of action buttons.

### Action buttons

| Component | Attribute | Type | Default | Meaning |
| --- | --- | --- | --- | --- |
| `Modal.NextButton` | `text` | `string` | `"Next"` | Button label |
| | `intent` | `primary \| secondary \| tertiary \| header` | `primary` | Visual style |
| | `onBeforeNext` | `() => boolean \| Promise<boolean>` | — | Runs before advancing; return `false` (or throw) to block |
| `Modal.BackButton` | `text` | `string` | `"Back"` | Button label |
| | `intent` | _as above_ | `tertiary` | Visual style |
| `Modal.CloseButton` | `text` | `string` | `"Close"` | Button label |
| | `intent` | _as above_ | `primary` | Visual style |
| `Modal.ActionButton` | `text` | `string` | — | Button label (required) |
| | `intent` | _as above_ | `primary` | Visual style |
| | `onClick` | `(nav) => void \| Promise<void>` | — | Custom handler; receives the navigation surface |

### Navigation surface (`useModalNav`)

| Member | Type | Meaning |
| --- | --- | --- |
| `next` | `() => void` | Advance to the next page |
| `back` | `() => void` | Go to the previous page |
| `goTo` | `(id: string) => void` | Jump to a page by `id` |
| `close` | `() => void` | Close, resolving to `undefined` |
| `resolve` | `(value) => void` | Close, resolving to `value` |
| `currentIndex` | `number` | Active page index (zero-based) |
| `pageCount` | `number` | Total number of pages |
