import { useState } from "react";

const useAvatarState = () => {
  const [avatar, setAvatar] = useState("");
  return [avatar, setAvatar];
};

export default useAvatarState;
