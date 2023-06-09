import * as Mineflayer from 'mineflayer';

export default function (bot: Mineflayer.Bot | any): void {
    let rotated = false, interval: any;
    bot.afk = {};
    bot.afk.start = () => {
        bot.setControlState('jump', true)
        interval = setInterval(() => rotate(), 5000)
    }
    bot.afk.stop = () => {
        bot.setControlState('jump', false)
        clearInterval(interval)
    }
    function rotate () {
        bot.look(rotated ? Math.PI : 0);
        rotated = !rotated
    }
}