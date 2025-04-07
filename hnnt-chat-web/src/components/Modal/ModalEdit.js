import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

import { updateUser } from '../../screens/Profile/api';

function ModalEdit({ setIsType, onClose }) {
    const userActive = useSelector((state) => state.auth.userActive);
    const dispatch = useDispatch();

    const [isName, setIsName] = useState(userActive?.name);
    const [gender, setGender] = useState(userActive?.gender);

    // -----------------------------------------------------
    const currentYear = new Date().getFullYear();

    // const [birthDay, birthMonth, birthYear] = userActive?.birthDate.split('/').map((num) => parseInt(num, 10));

    const date = new Date(userActive?.birthDate);

    const [day, setDay] = useState(date.getUTCDate());
    const [month, setMonth] = useState(date.getUTCMonth() + 1);
    const [year, setYear] = useState(date.getUTCFullYear());
    const [maxDays, setMaxDays] = useState(31);

    // Hàm kiểm tra số ngày hợp lệ trong tháng
    const getMaxDays = (month, year) => {
        if ([4, 6, 9, 11].includes(month)) return 30; // Tháng 4, 6, 9, 11 có 30 ngày
        if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28; // Tháng 2
        return 31; // Các tháng còn lại có 31 ngày
    };

    // Cập nhật số ngày hợp lệ khi tháng hoặc năm thay đổi
    useEffect(() => {
        const newMaxDays = getMaxDays(month, year);
        setMaxDays(newMaxDays);

        if (day > newMaxDays) {
            setDay(newMaxDays); // Giữ ngày trong phạm vi hợp lệ
        }
    }, [month, year]);

    const handleUpdateUser = async () => {
        const data = await updateUser(
            isName,
            gender,
            `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        );

        dispatch(setUser({ userActive: data, token: null }));

        setIsType('profile');
    };

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }} // Bắt đầu ngoài màn hình bên phải
            animate={{ x: '0%', opacity: 1 }} // Trượt vào giữa màn hình
            exit={{ x: '100%', opacity: 0 }} // Khi đóng, trượt ngược ra phải
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex flex-col h-full"
        >
            <div className="border-t pt-2 mx-4">
                <p className="text-sm">Tên hiển thị</p>
                <input
                    type="text"
                    id="default-search"
                    class="w-full border-2 border-gray-200 p-2 rounded-md mt-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={isName}
                    onChange={(e) => setIsName(e.target.value)}
                />

                <p className="text-base font-semibold mt-6">Thông tin cá nhân</p>
                <div className="flex space-x-4 mt-4 ">
                    {/* Giới tính */}
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <FormControlLabel className="text-gray-700" value="Nam" control={<Radio />} label="Nam" />
                            <FormControlLabel className="text-gray-700" value="Nữ" control={<Radio />} label="Nữ" />
                        </RadioGroup>
                    </FormControl>
                </div>

                {/* ngày sinh */}
                <p className="text-sm mt-4 mb-2">Ngày sinh</p>
                <div className="flex gap-2 w-full h-10">
                    {/* Ngày */}
                    <Select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        style={{ minWidth: '30%' }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: maxDays }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Tháng */}
                    <Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        style={{ minWidth: '30%' }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Năm */}
                    <Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        style={{ minWidth: '35%' }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 100 }, (_, i) => {
                            const y = currentYear - i;
                            return (
                                <MenuItem key={y} value={y}>
                                    {y}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </div>
            </div>

            {/* button cập nhật */}
            <div className="border-t pt-2 flex justify-end mt-auto">
                <button
                    onClick={() => setIsType('profile')}
                    className="bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-2"
                >
                    <p className="font-semibold">Hủy</p>
                </button>

                <button
                    onClick={() => {
                        handleUpdateUser();
                    }}
                    className="bg-blue-600 hover:bg-blue-800 rounded-md flex items-center justify-center gap-2 p-2 cursor-pointer mr-3"
                >
                    <p className="font-semibold text-white">Cập nhật</p>
                </button>
            </div>
        </motion.div>
    );
}

export default ModalEdit;
