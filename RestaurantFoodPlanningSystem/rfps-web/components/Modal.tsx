import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;
    
    return (
      <div className={"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"}>
          <div className={"bg-white p-6 rounded-lg"}>
              {children}
              <button onClick={onClose} className={"mt-4 bg-blue-500 text-white px-4 py-2 rounded"}>
                  Close
              </button>
          </div>
          
      </div>  
    )
}

export default Modal;