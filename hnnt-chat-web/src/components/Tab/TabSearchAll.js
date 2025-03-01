function TabSearchAll({ results, keyword }) {
    const highlightKeyword = (content, keyword) => {
        if (!keyword.trim()) return content; // Nếu không có keyword thì trả về nguyên content
        const regex = new RegExp(`(${keyword})`, 'gi'); // Regex tìm từ khóa (không phân biệt hoa/thường)
        return content.replace(regex, `<mark class="bg-blue-300">$1</mark>`); // Dùng $1 để tránh lỗi XSS
    };

    const renderResults = (type, label) => {
        const filteredResults = results.filter((r) => r?.type === type);
        if (filteredResults.length === 0) return null; // Nếu không có kết quả thì không render

        return (
            <>
                <p className="font-medium text-[13px]">{label}</p>
                {filteredResults.map((r, index) => (
                    <div
                        key={index}
                        className="relative flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer"
                    >
                        <img src={r.avatar} alt="avatar" className="w-[35px] h-[35px] object-cover rounded-full mr-2" />
                        <div>
                            <p className="font-medium text-[12px] mb-[2px]">{r.name}</p>
                            <p
                                className="text-[12px] max-w-[200px] truncate"
                                dangerouslySetInnerHTML={{
                                    __html: highlightKeyword(type === 'text' ? r.content : r.fileName, keyword),
                                }}
                            ></p>
                            <p className="absolute right-[10px] top-[5px] text-[12px] mb-[2px]">{r.time}</p>
                        </div>
                    </div>
                ))}
            </>
        );
    };

    return (
        <div className="mt-1 overflow-auto dark:bg-gray-800 dark:text-gray-300">
            {renderResults('text', 'Tin nhắn')}
            {renderResults('file', 'File')}
        </div>
    );
}

export default TabSearchAll;
