## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Internalization (i18n)

### i18n in Client Components

Use the `useTranslation()` hook from `DictionaryProvider`.

```typescript
"use client";

import { useTranslation } from "@/components/DictionaryProvider/DictionaryProvider";

export const ClientComponent = () => {
  const t = useTranslation();

  return <p>{t["title"]}</p>;
};
```

### i18n in Server Components

#### Method 1: Prop Drilling

Since we cannot use react context in server components there is no way to pass down the dictionary translation data from the root layout without prop drilling. This will change once Next.js implements createServerContext and we'll update according but for now you have to just prop drill. The earliest you can start prop drilling is in the RootLayout (app/layout.tsx) but it won't always be possible so see method 2.

#### Method 2: getDictionary()

If you do not want to prop drill or it is not possible, then you just have to request the translation data again:

```typescript
import { getDictionary } from "@/utils/get-dictionary";

export default async function ServerComponent({ params }: { params: LParam }) {
  const t = await getDictionary(params.lang);
  return (
    <div>
      <h1>{t["title"]}</h1>
      {// try to prop drill if you need to pass it down again versus calling getDictionary() again in AnotherServerComponent}
      <AnotherServerComponent dictionary={t}></AnotherServerComponent>
    </div>
  );
}
```

Generally you want to avoid requesting this data again and again so try your best to prop drill until we get Server Context.
