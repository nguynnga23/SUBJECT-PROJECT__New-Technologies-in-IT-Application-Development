import { useState } from 'react';

const tabs = ['Tất cả', 'Liên hệ', 'Tin nhắn', 'File'];

function TabSearch() {
    const [activeSearchTab, setActiveSearchTab] = useState('Tất cả');

    return (
        <div>
            <div className="flex mt-2 border-b pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 text-sm text-gray-600 px-2 py-1 ${
                            activeSearchTab === tab ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : ''
                        }`}
                        onClick={() => {
                            setActiveSearchTab(tab);
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div>{/* Load dữ liệu search */}</div>
        </div>
    );
}

export default TabSearch;
