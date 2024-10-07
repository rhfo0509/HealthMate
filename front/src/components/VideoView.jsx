import React, { useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";

function VideoView({ URL, isDetailMode }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const { width } = useWindowDimensions();

  return (
    <Video
      ref={video}
      style={{
        alignSelf: "center",
        width: isDetailMode ? width - 16 : 180,
        height: isDetailMode ? (width / 16) * 9 : 180,
        marginLeft: isDetailMode ? 0 : 16,
        marginBottom: 16,
      }}
      source={{
        uri: URL,
      }}
      useNativeControls={isDetailMode}
      isLooping={false}
      resizeMode={ResizeMode.CONTAIN}
      onPlaybackStatusUpdate={(status) => setStatus(() => status)}
    />
  );
}

export default VideoView;
