import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Highlight, { defaultProps } from "prism-react-renderer";

const Code = () => null;

const DemoTabs = ({ children, code }) => {
  const codeSlot = children.find((el) => el.type === Code);

  return (
    <Tabs
      defaultValue="preview"
      values={[
        { label: "Preview", value: "preview" },
        { label: "Code", value: "code" },
      ]}
    >
      <TabItem value="code">
        <Highlight
          {...defaultProps}
          code={codeSlot.props.children.trim()}
          language={"html"}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, padding: "20px" }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </TabItem>
      <TabItem value="preview">{children}</TabItem>
    </Tabs>
  );
};

DemoTabs.Code = Code;
export default DemoTabs;
