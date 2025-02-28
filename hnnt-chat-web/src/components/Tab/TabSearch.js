import { useState } from 'react';
import TabSearchAll from './TabSearchAll';
import TabSearchMessage from './TabSearchMessage';
import TabSearchFile from './TabSearchFile';
import { useSelector } from 'react-redux';

const tabs = ['Tất cả', 'Tin nhắn', 'File'];

function TabSearch({ keyword }) {
    const [activeSearchTab, setActiveSearchTab] = useState('Tất cả');
    const searchResults = useSelector((state) => state.chat.searchResults);
    return (
        <div className="p-4 pt-1 dark:bg-gray-800 ">
            <div className="flex border-b dark:border-b-black ">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 text-sm text-gray-600 dark:text-gray-300 px-2 py-1 ${
                            activeSearchTab === tab ? 'text-blue-600 border-b-2  border-blue-600 font-medium' : ''
                        }`}
                        onClick={() => {
                            setActiveSearchTab(tab);
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="overflow-auto max-h-[calc(100vh_-_110px)]">
                {activeSearchTab === 'Tất cả' && <TabSearchAll results={searchResults} keyword={keyword} />}
                {activeSearchTab === 'Tin nhắn' && <TabSearchMessage results={searchResults} keyword={keyword} />}
                {activeSearchTab === 'File' && <TabSearchFile results={searchResults} keyword={keyword} />}
            </div>
        </div>
    );
}

export default TabSearch;
