'use client';

import { ReactNode, useEffect, useState } from 'react';
import GlobalReadPageButton from './GlobalReadPageButton';

interface ReadableItem {
  id: string;
  text: string;
}

interface ReadPageContentProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function ReadPageContent({ children, pageTitle }: ReadPageContentProps) {
  return (
    <>
      <div data-tts-content>
        {children}
      </div>
      <GlobalReadPageButton 
        pageTitle={pageTitle}
      />
    </>
  );
}