"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";

import { useThemeMode } from "../../hooks";
import { BackgroundColors } from "../../utils/constants/colors";
import { ModalProps } from "./index.types";

const Modal = React.memo<ModalProps>(({ children, style, isOpen, onClose, maskClosable = true }) => {
  const { isDarkThemeMode } = useThemeMode();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={maskClosable ? onClose : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isDarkThemeMode ? BackgroundColors.dark : BackgroundColors.light,
              border: `1px solid ${isDarkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              borderRadius: "8px",
              minWidth: "300px",
              maxWidth: "90%",
              maxHeight: "90%",
              padding: "24px 32px",
              boxShadow: `
                rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, 
                rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, 
                rgba(0, 0, 0, 0.12) 0px 1px 8px 0px
              `,
              overflow: "auto",
              ...style,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = "Modal";
export default Modal;
