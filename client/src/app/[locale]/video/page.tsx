// import * as React from "react";
// import { WherebyProvider, useRoomConnection, VideoView } from "@whereby.com/browser-sdk/react";

// function App() {
//   return (
//     // Wrap your app in the provider
//     <WherebyProvider>
//       <MyVideoApp />
//     </WherebyProvider>
//   )
// }

// function MyVideoApp( { roomUrl, localStream }) {
//     const { state, actions } = useRoomConnection(
//         "<room_url>"
//         {
//             localMediaOptions: {
//                 audio: true,
//                 video: true,
//             }
//         }
//     );

//     const { connectionState, remoteParticipants } = state;
//     const { joinRoom, leaveRoom } = actions;

//     React.useEffect(() => {
//         joinRoom();
//         return () => leaveRoom();
//     }, []);

//     return <div className="videoGrid">
//         { /* Render any UI, making use of state */ }
//         { remoteParticipants.map((p) => (
//             <VideoView key={p.id} stream={p.stream} />
//         )) }
//     </div>;
// }

import React from 'react'

export default function Page() {
    return (
        <div></div>
    )
}
