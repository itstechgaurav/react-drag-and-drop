import { Component } from "react";
import "./App.css";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import List from "./List";

interface items {
  name: string;
  id: number;
  quantity: number;
}

interface AppStateTypes {
  lists: Map<string, items[]>;
}
class App extends Component<any, AppStateTypes> {
  state = {
    lists: new Map(),
  };
  componentWillMount() {
    const defaultList = new Map();
    defaultList.set("Default-Bucket", [
      { name: "something", id: 1, quantity: 4 },
      { name: "hello", id: 2, quantity: 4 },
      { name: "nothing", id: 5, quantity: 4 },
      { name: "world", id: 6, quantity: 4 },
    ]);

    this.setState({
      lists: defaultList,
    });
  }

  updateSameList(target: DropResult) {
    const lists = this.state.lists;
    const sourceIndex = target.source.index;
    const source = lists.get(target.source.droppableId)[sourceIndex];
    const destinationIndex = target?.destination?.index;

    if (!destinationIndex) return;

    const destination = lists.get(target?.destination?.droppableId)[
      destinationIndex
    ];
    const list = lists.get(target.source.droppableId);
    list[sourceIndex] = destination;
    list[destinationIndex] = source;
    lists.set(target.source.droppableId, list);

    this.setState({
      lists,
    });
  }

  updateDifferentList(target: any) {
    const lists = this.state.lists;
    let sourceList = lists.get(target.source.droppableId);
    let destinationList = lists.get(target.destination.droppableId);

    const itemToBeDroped = Object.assign({}, sourceList[target.source.index]);
    const indexToDrop = target.destination.index;

    let itemInDestinationList = destinationList.find(
      (item: items) => item.id === itemToBeDroped.id
    );

    itemToBeDroped.quantity--;
    if (itemToBeDroped.quantity < 0) return;
    sourceList[target.source.index] = {
      ...itemToBeDroped,
    };

    if (itemInDestinationList) {
      itemInDestinationList.quantity++;
      lists.set(target.source.droppableId, sourceList);
      lists.set(target.destination.droppableId, destinationList);
      this.setState({
        lists: lists,
      });
    } else {
      itemInDestinationList = {
        ...itemToBeDroped,
        quantity: 1,
      };

      lists.set(target.source.droppableId, sourceList);
      lists.set(target.destination.droppableId, [
        ...destinationList.splice(0, indexToDrop),
        itemInDestinationList,
        ...destinationList.splice(indexToDrop),
      ]);
      this.setState({
        lists: lists,
      });
    }
  }

  onDragEnd = (target: DropResult) => {
    if (target.source.droppableId === target?.destination?.droppableId)
      this.updateSameList(target);
    else this.updateDifferentList(target);
  };

  addNewList = () => {
    const listName = prompt("Enter list name: ");
    const lists = this.state.lists;
    lists.set(listName?.replaceAll(" ", ""), []);

    this.setState({
      lists: lists,
    });
  };

  addNewItemToList = (listName: string, item: items) => {
    const lists = this.state.lists;
    const list = lists.get(listName);
    list.unshift(item);
    lists.set(listName, list);

    this.setState({
      lists,
    });
  };

  removeBucket = (containerId: string) => {
    const lists = this.state.lists;
    const bucket = lists.get(containerId);

    let defaultBucket = lists.get("Default-Bucket");
    bucket.forEach((item: items) => {
      defaultBucket = defaultBucket.map((defaultBucketItem: items) => {
        if (item.id === defaultBucketItem.id) {
          defaultBucketItem.quantity += item.quantity;
        }
        return defaultBucketItem;
      });
    });

    // remove bucket
    lists.delete(containerId);

    // update buckets
    lists.set("Default-Bucket", defaultBucket);

    this.setState({
      lists,
    });
  };

  render() {
    console.log(this.state.lists);
    return (
      <div className="app">
        <h1>React Drag And Drop</h1>
        <div className="list-container">
          <DragDropContext onDragEnd={this.onDragEnd}>
            {[...(this.state.lists.keys() as any)].map((key, index) => (
              <List
                key={key}
                title={key}
                containerId={key}
                list={this.state.lists.get(key)}
                onRemoveBucket={this.removeBucket}
                allowDelete={index !== 0}
                // onNewItem={this.addNewItemToList}
              ></List>
            ))}
          </DragDropContext>
          <button onClick={this.addNewList}>Add new list</button>
        </div>
      </div>
    );
  }
}

export default App;
