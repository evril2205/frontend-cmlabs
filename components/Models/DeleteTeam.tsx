import React from "react";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/solid";

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[404px] h-[394px] p-6 rounded-2xl shadow-lg text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full bg-[#A73623] flex items-center justify-center">
            <TrashIcon className="w-16 h-16 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Are you sure you want to delete<br />this team member?
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          This action cannot be undone. The team member will lose access to the CRM and all associated data.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-[#F51B0D] text-white px-6 py-2 rounded-lg font-medium hover:bg-red-500"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="bg-white border border-[#F51B0D] text-[#441B1B] px-6 py-2 rounded-lg font-medium hover:bg-red-200"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalDelete;
