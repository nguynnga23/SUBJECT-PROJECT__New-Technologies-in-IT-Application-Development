function TabSearchFile({ results, keyword }) {
    const highlightKeyword = (content, keyword) => {
        if (!keyword.trim()) return content; // Nếu không có keyword thì trả về nguyên content
        const regex = new RegExp(`(${keyword})`, 'gi'); // Regex tìm từ khóa (không phân biệt hoa/thường)
        return content.replace(regex, `<mark class="bg-blue-300">${keyword}</mark>`);
    };

    return (
        <div className="mt-1 overflow-auto dark:bg-gray-800 dark:text-gray-300">
            {results
                .filter((r) => r?.type === 'file')
                .map((r, index) => (
                    <div
                        className="relative flex items-center p-2 hover:bg-gray-200 hover:dark:bg-gray-500 cursor-pointer "
                        key={index}
                    >
                        <img src={r.avatar} alt="avatar" className="w-[35px] h-[35px] object-cover rounded-full mr-2" />
                        <div>
                            <p className="font-medium text-[12px] mb-[2px]">{r.name}</p>
                            <p
                                className="text-[12px] max-w-[200px] truncate"
                                dangerouslySetInnerHTML={{ __html: highlightKeyword(r.fileName, keyword) }}
                            ></p>
                            <p className="absolute right-[5px] top-[5px] text-[12px] mb-[2px]">{r.time}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default TabSearchFile;
