import { Component } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface listType {
  name: string;
  id: number;
  quantity: number;
}

interface ListPropsTypes {
  title: string;
  list: listType[];
  containerId: string;
  onNewItem?: Function;
  onRemoveBucket: Function;
  allowDelete: boolean;
}

const generateItem = (id: number): any => {
  return <div className="list-item">Item - {id}</div>;
};

class List extends Component<ListPropsTypes> {
  render() {
    return (
      <div className="list">
        <h1 className="list-title">{this.props.title}</h1>
        <Droppable droppableId={this.props.containerId}>
          {(dropableProvider, dropableSnapshot) => (
            <div ref={dropableProvider.innerRef}>
              {this.props.list.map((item, index) => {
                const combinedId = `${this.props.title}-item-${item.id}`;
                return (
                  <Draggable
                    index={index}
                    key={combinedId}
                    draggableId={combinedId}
                  >
                    {(draggableProvider, draggableSnapshot) => (
                      <div
                        className="list-item"
                        ref={draggableProvider.innerRef}
                        {...draggableProvider.draggableProps}
                        {...draggableProvider.dragHandleProps}
                      >
                        {item.name} - {item.quantity}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {dropableProvider.placeholder}
            </div>
          )}
        </Droppable>

        {this.props.allowDelete && (
          <button
            onClick={() => this.props.onRemoveBucket(this.props.containerId)}
          >
            Remove Bucket
          </button>
        )}
        {/* <button
          onClick={() => {
            const itemName = prompt("Item Name: ");
            const item = {
              name: itemName,
              id: Date.now().toString(),
              quantity: 4,
            };

            this.props.onNewItem(this.props.title, item);
          }}
        >
          Add Item To List
        </button> */}
      </div>
    );
  }
}

export default List;
