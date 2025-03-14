export const handleReport = (reportReason, setReportVisible) => {
    if (!reportReason) return;
    console.log("Report reason:", reportReason);
    setReportVisible(false);
};

export const handleBlock = (setBlockVisible, navigation) => {
    console.log("Block user");
    setBlockVisible(false);
    navigation.reset({
        index: 0,
        routes: [{ name: "MessageScreen" }],
    });
};

export const toggleMute = (isMuted, setIsMuted) => {
    setIsMuted(!isMuted);
};