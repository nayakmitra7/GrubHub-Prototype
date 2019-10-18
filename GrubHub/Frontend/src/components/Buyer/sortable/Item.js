import React from 'react';
import { sortable } from 'react-sortable';
 class Item extends React.Component {
    render() {
      return (
        <li {...this.props}>
          {this.props.children}
        </li>
      )
    }
  }
   
   
  export var SortableItem = sortable(Item);