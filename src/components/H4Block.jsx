import { createReactBlockSpec } from "@blocknote/react";

export const H4Block = createReactBlockSpec(
  {
    type: "h4",
    propSchema: {},
    content: "inline",
  },
  {
    render: (props) => (
      <h4 style={{ fontSize: "1.2em", fontWeight: 600, margin: 0 }}>
        <span ref={props.contentRef} />
      </h4>
    ),
  }
);