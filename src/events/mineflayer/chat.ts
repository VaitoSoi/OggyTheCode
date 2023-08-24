import { EventBuilder, MineflayerEvents } from "../../lib";

export default new EventBuilder()
    .setName(MineflayerEvents.Chat)
    .setRun((client, username, message) => {
        
    })