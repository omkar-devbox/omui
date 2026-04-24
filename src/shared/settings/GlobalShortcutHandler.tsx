import React from "react";
import { useNavigate } from "react-router-dom";
import { useShortcut } from "./useShortcut";
import { useInteractionStore } from "./interactionStore";

export const GlobalShortcutHandler: React.FC = () => {
  const navigate = useNavigate();
  const customNavs = useInteractionStore((state) => state.customNavs);

  useShortcut({
    action: "navDashboard",
    onTrigger: () => navigate("/"),
  });

  useShortcut({
    action: "navSettings",
    onTrigger: () => navigate("/settings"),
  });

  useShortcut({
    action: "navBack",
    onTrigger: () => navigate(-1),
  });

  useShortcut({
    action: "navForward",
    onTrigger: () => navigate(1),
  });

  // Handle custom dynamic navigation shortcuts
  return (
    <>
      {customNavs.map((nav) => (
        <CustomNavListener key={nav.id} nav={nav} navigate={navigate} />
      ))}
    </>
  );
};

const CustomNavListener: React.FC<{ 
  nav: { id: string; path: string }; 
  navigate: (path: string | number) => void 
}> = ({ nav, navigate }) => {
  useShortcut({
    action: nav.id,
    onTrigger: () => navigate(nav.path),
  });
  return null;
};
