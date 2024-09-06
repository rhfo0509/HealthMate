import { useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";

function VideoView({ URL }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const { width } = useWindowDimensions();

  return (
    <Video
      ref={video}
      style={{
        alignSelf: "center",
        width: width,
        height: (width / 16) * 9,
        marginBottom: 16,
      }}
      source={{
        uri: URL,
      }}
      useNativeControls={true}
      isLooping={false}
      resizeMode={ResizeMode.CONTAIN}
      onPlaybackStatusUpdate={(status) => setStatus(() => status)}
    />
  );
}

export default VideoView;
