import React from 'react';
import {Text, Pressable} from 'react-native';

export enum ExpandType {
  LEAF,
  NODE,
}

interface ListNodeProps {
  title: string;
  expandType: ExpandType;
}

const handleExpandChildren = (expandType: ExpandType) => {
  console.log(expandType);
};

export const ListNode = ({title, expandType}: ListNodeProps) => {
  return (
    <Pressable onPress={() => handleExpandChildren(expandType)}>
      <Text>{title}</Text>
      {['child', 'child2'].map(ele => (
        <Pressable>
          <Text>{ele}</Text>
        </Pressable>
      ))}
    </Pressable>
  );
};
