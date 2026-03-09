"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function RedirectContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const tema = searchParams.get("tema");

  useEffect(() => {
    const target = `/${subjectId}/quiz${tema ? `?topic=${tema}` : ""}`;
    router.replace(target);
  }, [subjectId, tema, router]);

  return null;
}

export default function KvizRedirect() {
  return <Suspense><RedirectContent /></Suspense>;
}
