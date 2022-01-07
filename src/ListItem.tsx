import { Component, ElementType } from "react";

interface ListItemPropsType {
  children: ElementType;
}

class ListItem extends Component<ListItemPropsType> {
  render() {
    return this.props.children;
  }
}
