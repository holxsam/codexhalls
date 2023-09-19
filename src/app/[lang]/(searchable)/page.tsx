import { getDictionary } from "@/utils/get-dictionary";
import { LParam } from "../layout";

export default async function Home({ params }: { params: LParam }) {
  const t = await getDictionary(params.lang);

  return <div className="isolate flex flex-col gap-28"></div>;
}
