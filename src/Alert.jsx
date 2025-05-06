import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Dropdown, Menu } from "antd";
import { 
  WarningOutlined, 
  CloseCircleOutlined, 
  InfoCircleOutlined, 
  CheckCircleOutlined 
} from "@ant-design/icons";
 
import "./App.css";
 
// The types of alerts that users can choose from.
export const alertTypes = [
  {
    title: "Warning",
    value: "warning",
    icon: WarningOutlined,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error",
    icon: CloseCircleOutlined,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info",
    icon: InfoCircleOutlined,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success",
    icon: CheckCircleOutlined,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
];
 
// The Alert block.
export const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const alertType = alertTypes.find(
        (a) => a.value === props.block.props.type
      );
      const IconComponent = alertType.icon;
      
      // Define menu items for the dropdown
      const menu = (
        <Menu
          items={alertTypes.map((type) => ({
            key: type.value,
            icon: <type.icon style={{ color: type.color }} />,
            label: type.title,
            onClick: () => 
              props.editor.updateBlock(props.block, {
                type: "alert",
                props: { type: type.value },
              })
          }))}
        />
      );

      return (
        <div className={"alert"} data-alert-type={props.block.props.type}>
          {/*Icon which opens a menu to choose the Alert type*/}
          <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
            <div className={"alert-icon-wrapper"} contentEditable={false}>
              <IconComponent
                className={"alert-icon"}
                data-alert-icon-type={props.block.props.type}
                style={{ fontSize: '32px' }}
              />
            </div>
          </Dropdown>
          {/*Rich text field for user to type in*/}
          <div className={"inline-content"} ref={props.contentRef} />
        </div>
      );
    },
  }
);