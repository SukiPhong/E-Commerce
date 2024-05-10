import React, { createContext, useContext } from "react";
import useAvatarState from "./avatarState";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const avatarState = useAvatarState();

  return (
    <AvatarContext.Provider value={avatarState}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  return useContext(AvatarContext);
};
