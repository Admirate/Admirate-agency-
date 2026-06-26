"use client";

import dynamic from "next/dynamic";

const ScrollDissolve = dynamic(() => import("@/components/ui/scroll-dissolve"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        height: "60vh",
        background: "linear-gradient(to bottom, #0A0A0A, #FAFAF7)",
      }}
    />
  ),
});

type Props = {
  colorFrom: string;
  colorTo: string;
  height?: string;
};

const ScrollDissolveClient = (props: Props) => <ScrollDissolve {...props} />;

export default ScrollDissolveClient;
