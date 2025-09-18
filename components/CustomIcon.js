import React, { useRef, useEffect } from "react";
import { Player } from "@lordicon/react";

// Import the icon JSON file
import ICON from "../public/images/google.json"; // Make sure this path is correct

const CustomIcon = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playFromBeginning();
    }
  }, []);

  return (
    <div>
      <Player ref={playerRef} size={35} icon={ICON} />
    </div>
  );
};

export default CustomIcon;
