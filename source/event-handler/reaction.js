const { Events, EmbedBuilder } = require('discord.js');

process.on("unhandledRejection", (err) => console.error(err));

module.exports = {
  name: Events.ClientReady,
  execute(client) {
    client.on(Events.InteractionCreate, async interaction => {
      const verifiedRole = '1069116348669628476';

      if (interaction.customId === 'accept-terms') {
        await interaction.deferReply({ ephemeral: true });

        const giveRole = async () => {
          const embed = new EmbedBuilder()
            .setDescription(`Discord Role: <@&${verifiedRole}>\nHas been added to your account.`)
            .setFooter({ text: 'Tip: Contact support if there are issues.' })
            .setColor('#2ecc71')

          console.log('Role Given')
          await interaction.member.roles.add(verifiedRole)
          await interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        await interaction.member.roles.cache.has(verifiedRole)
          ? giveRole() : giveRole()
      }

      if (interaction.customId === 'decline-terms') {
        await interaction.deferReply({ ephemeral: true });

        const removeRole = async () => {
          const embed = new EmbedBuilder()
            .setDescription(`Discord Role: <@&${verifiedRole}>\nHas been removed from your account.`)
            .setFooter({ text: 'Tip: Contact support if there are issues.' })
            .setColor('#e67e22')

          console.log('Role Removed')
          await interaction.member.roles.remove(verifiedRole)
          await interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        await interaction.member.roles.cache.has(verifiedRole)
          ? removeRole() : removeRole()
      }
    });
  },
};