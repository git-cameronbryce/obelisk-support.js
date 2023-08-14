const { Events, EmbedBuilder } = require('discord.js');

process.on("unhandledRejection", (err) => console.error(err));

module.exports = {
  name: Events.ClientReady,

  execute(client) {
    client.on('guildMemberAdd', async (member) => {
      console.log(member.user.id);

      const channel = await client.channels.fetch('1069116735099256842');
      const unix = Math.floor(Date.now() / 1000);

      const embed = new EmbedBuilder()
        .setDescription(`Welcome to our community hub!\nReach out for support.\n<t:${unix}:f>\n\n<#1071596446178099342>`)
        .setFooter({ text: 'Tip: Contact support if there are issues.' })
        .setThumbnail('https://i.imgur.com/z6J81xQ.png')
        .setColor('#2ecc71');

      await channel.send({ content: `${member.user}`, embeds: [embed] });
    },
    );
  }
};
