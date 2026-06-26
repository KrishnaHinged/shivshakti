import React, { useEffect } from "react";
import { X } from "lucide-react";
import useBodyLock from "@/shared/hooks/useBodyLock";

/**
 * Composable, accessible Modal System.
 * Replaces ad-hoc overlay blocks across all features.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Triggered when close requested
 * @param {"sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"} [props.size="lg"] - Maximum width constraints
 * @param {string} [props.className=""] - Custom classes for content wrapper
 */
export default function Modal({
  children,
  isOpen,
  onClose,
  size = "lg",
  className = "",
  ...rest
}) {
  // Lock body scrolling when modal is open
  useBodyLock(isOpen);

  // Esc key close handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size mapping classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    "2xl": "max-w-4xl",
    "3xl": "max-w-5xl",
    "4xl": "max-w-6xl",
    "5xl": "max-w-7xl",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.lg;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        className={`bg-white rounded-2xl w-full ${selectedSize} overflow-hidden shadow-2xl flex flex-col transition duration-300 transform scale-100 ${className}`}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        {/* Pass down onClose to headers if needed via React Context or just children composition */}
        <ModalContext.Provider value={{ onClose }}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>
  );
}

// Simple React Context to pass onClose down to Modal.Header's button
const ModalContext = React.createContext({ onClose: () => {} });

Modal.Header = function ModalHeader({ children, showClose = true, className = "", ...rest }) {
  const { onClose } = React.useContext(ModalContext);
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 ${className}`} {...rest}>
      <div>{children}</div>
      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className = "", ...rest }) {
  return (
    <div className={`p-6 overflow-y-auto max-h-[75vh] custom-scrollbar ${className}`} {...rest}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children, className = "", ...rest }) {
  return (
    <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 ${className}`} {...rest}>
      {children}
    </div>
  );
};
