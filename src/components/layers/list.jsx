import React, { Component } from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import SortableItem from './item';

const SortableList = SortableContainer(
  ({ items = [], selection, uniqueIdToken, onClickCallback }) => (
    <ul className="layers">
      {items.map((item, index) => {
        return (
          <SortableItem
            key={`sortable-item-${index}`}
            preview={item.preview}
            checked={item.active}
            uniqueIdToken={uniqueIdToken}
            index={index}
            onClickCallback={onClickCallback}
            className="layers"
            uuid={item.index}
          />
        );
      })
      }
    </ul>
  )
);

export default SortableList;