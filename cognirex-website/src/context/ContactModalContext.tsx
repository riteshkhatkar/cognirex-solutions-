"use client";

import React, { createContext, useContext, useState } from "react";

interface ContactModalContextType {
  isOpen: boolean;
  activeTab: "enquiry" | "meeting";
  openModal: (tab?: "enquiry" | "meeting") => void;
  closeModal: () => void;
  setTab: (tab: "enquiry" | "meeting") => void;
}

const ContactModalContext = createContext<ContactModalContextType>({
  isOpen: false,
  activeTab: "enquiry",
  openModal: () => {},
  closeModal: () => {},
  setTab: () => {},
});

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"enquiry" | "meeting">("enquiry");

  const openModal = (tab: "enquiry" | "meeting" = "enquiry") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const setTab = (tab: "enquiry" | "meeting") => setActiveTab(tab);

  return (
    <ContactModalContext.Provider value={{ isOpen, activeTab, openModal, closeModal, setTab }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  return useContext(ContactModalContext);
}
