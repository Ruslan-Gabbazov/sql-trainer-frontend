import React from "react";
import Layout from "@theme/Layout";

export default function SandboxOne() {
  return (
    <Layout>
      <iframe
        src="https://onecompiler.com/postgresql"
        title="onecompiler"
        width="100%"
        height="98%"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          bottom: -12,
          right: 0,
          // width: '100%',
          // height: '100%',
          border: "none",
          overflow: "none",
        }}
      />
    </Layout>
  );
}
