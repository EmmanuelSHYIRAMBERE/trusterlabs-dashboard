import { SuccessToastProps } from "@/types/profile";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-start gap-3 min-w-[320px] max-w-md">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {message.title}
            </h4>
            <p className="text-sm text-gray-600">{message.description}</p>
          </div>
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-full"
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SuccessToast;
