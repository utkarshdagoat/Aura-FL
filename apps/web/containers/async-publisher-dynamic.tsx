import dynamic from "next/dynamic";

export default dynamic(() => import("./async-publisher-page"), {
  ssr: false,
});

