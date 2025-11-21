'use client';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';
import KeywordMappingTable from './keyword-mapping-table';
import OnPageTable from './on-page-table';

type Tabs = 'keyword' | 'on-page';

interface Tab {
  id: Tabs;
  element: React.ReactElement;
  label: string;
}

export default function ResultTable({ result }: { result: any }) {
  if (!result) return null;

  const [activeTab, setActiveTab] = useState<Tabs>('on-page');

  const TABS: Tab[] = [
    {
      id: 'on-page',
      label: 'On-Page Targeting',
      element: <OnPageTable results={result.onpageResults as any[]} />,
    },
    {
      id: 'keyword',
      label: 'Keyword Mapping',
      element: <KeywordMappingTable results={result.keywordMapping as any[]} />,
    },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div className='my-8 flex items-center justify-center gap-2'>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={cn([
              'custom-glass-shadow rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white backdrop-blur-[10px] transition-all hover:bg-white/20',
              activeTab === tab.id && 'font-bold',
            ])}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <div>{TABS.find(tab => tab.id === activeTab)?.element}</div>
    </div>
  );
}
