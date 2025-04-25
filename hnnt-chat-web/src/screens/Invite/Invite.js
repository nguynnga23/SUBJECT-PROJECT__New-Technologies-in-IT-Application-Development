import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChatById, inviteMemberToGroup } from '../Messaging/api';
import { useSelector } from 'react-redux';

function Invite() {
    const { chatId } = useParams();
    const [dataGroup, setDataGroup] = useState(null);
    const navigate = useNavigate();

    const userActive = useSelector((state) => state.auth.userActive);
    const userId = userActive.id;

    useEffect(() => {
        const fetchGroupInfo = async () => {
            const res = await getChatById(chatId);
            setDataGroup(res);
        };
        fetchGroupInfo();
    }, [chatId]);

    const handleViteGroup = async () => {
        await inviteMemberToGroup(chatId, userId);
        navigate('/home');
    };

    const isMember = dataGroup?.participants?.some((p) => p.accountId === userId);

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <div className="flex items-center gap-4">
                    <img
                        src={
                            dataGroup?.avatar ||
                            'https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg'
                        }
                        alt="Avatar nhóm"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {dataGroup?.name || 'Group bí ẩn'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {dataGroup?.participants?.length} thành viên
                        </p>
                    </div>
                    {isMember ? (
                        <button
                            className="ml-auto bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed"
                            disabled
                        >
                            Đã tham gia
                        </button>
                    ) : (
                        <button
                            className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                            onClick={handleViteGroup}
                        >
                            Tham gia nhóm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Invite;
