import { createReactBlockSpec } from "@blocknote/react";

export const H4Block = createReactBlockSpec(
  {
    type: "h4",
    propSchema: {
      placeholder: { default: "Heading" },
    },
    content: "inline",
  },
  {
    render: (props) => {
      // Check if the block is empty or only contains an empty text node
      const content = props.block.content;
      const isEmpty = !content || content.length === 0 || (content.length === 1 && content[0].type === "text" && !content[0].text);
      return (
        <h4 style={{ fontSize: "1.2em", fontWeight: 600, margin: 0, position: 'relative' }}>
          <span ref={props.contentRef} />
          {isEmpty && (
            <span style={{ color: '#aaa', position: 'absolute', left: 0, top: -4, pointerEvents: 'none', userSelect: 'none' }}>
              {props.block.props.placeholder || "Heading"}
            </span>
          )}
        </h4>
      );
    },
  }
);