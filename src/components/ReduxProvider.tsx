"use client"



import store from '@/store/storeConfig';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';

interface Props {
  children: ReactNode;
}

const ReduxProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;