import React from "react";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <div className="text-blue-600 text-2xl font-bold">HNNT</div>
        <div className="hidden md:flex space-x-6 text-gray-800 font-semibold">
          <a href="#" className="hover:text-blue-600">HNNT PC</a>
          <a href="#" className="hover:text-blue-600">OFFICIAL ACCOUNT</a>
          <a href="#" className="hover:text-blue-600">NHÀ PHÁT TRIỂN</a>
          <a href="#" className="hover:text-blue-600">BẢO MẬT</a>
          <a href="#" className="hover:text-blue-600">TRỢ GIÚP</a>
          <a href="#" className="hover:text-blue-600">LIÊN HỆ</a>
          <a href="#" className="hover:text-blue-600">BÁO CÁO VI PHẠM</a>
          <a href="#" className="text-blue-600 font-semibold">ĐĂNG NHẬP</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold">Tải Zalo PC cho máy tính</h1>
        <p className="text-gray-600 mt-3">
          Ứng dụng HNNT PC đã có mặt trên Windows, Mac OS, Web
        </p>
        <ul className="text-gray-700 mt-4 text-left inline-block">
          <li>✔ Gửi file, ảnh, video cực nhanh lên đến 1GB</li>
          <li>✔ Đồng bộ tin nhắn với điện thoại</li>
          <li>✔ Tối ưu cho chat nhóm và trao đổi công việc</li>
        </ul>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center">
            <span className="text-xl">⬇</span> Tải ngay
          </button>
          <button className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg">
            🌐 Dùng bản web
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
