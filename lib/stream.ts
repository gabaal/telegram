import { StreamChat } from "stream-chat";

const streamClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!
)

export default streamClient;