const { CommandInteraction, MessageEmbed, Util } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { parse } = require('twemoji-parser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Phóng ta 1 emoji')
        .addStringOption(option => option
            .setName('emoji')
            .setDescription('Emoji cần phóng to')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
        let emoji = interaction.options.getString('emoji')
        let custom = Util.parseEmoji(emoji);
        const embed = new MessageEmbed()
            .setTitle(`Bản phóng to của ${custom.id ? `<:${custom.name}:${custom.id}>` : `${custom.name}`}`);

        if (custom.id) {
            let link = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`
            embed.setImage(link)
                .setFooter({ text: `ID: ${custom.id}` })
                .setURL(link);
            return interaction.editReply({ embeds: [embed] });
        } else {
            let parsed = parse(`:${emoji}:`, { assetType: 'png' });
            if (!parsed[0]) return interaction.editReply("Không tìm thấy emoji");
            embed.setImage(parsed[0].url);
            return interaction.editReply({ embeds: [embed] })
        }
    }
} 