import { EventBuilder, MineflayerEvents } from "../..";

export default new EventBuilder()
    .setName(MineflayerEvents.Chat)
    .setRun((client, username, message) => {
        
    })