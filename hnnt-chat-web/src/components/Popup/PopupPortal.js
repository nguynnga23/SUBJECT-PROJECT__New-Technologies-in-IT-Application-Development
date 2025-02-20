import { createPortal } from 'react-dom';

const PopupPortal = ({ children }) => {
    return createPortal(children, document.body);
};

export default PopupPortal;
