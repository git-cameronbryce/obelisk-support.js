const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { db } = require('../script.js');

process.on("unhandledRejection", (err) => console.error(err));

module.exports = {
  name: Events.ClientReady,

  execute(client) {
    client.on(Events.InteractionCreate, async interaction => {

      if (interaction.customId === 'suggest-here') {
        const modal = new ModalBuilder()
          .setCustomId('suggest-modal')
          .setTitle('Suggestion Title');

        const suggestionInput = new TextInputBuilder()
          .setCustomId('suggestion')
          .setLabel('Customer Suggestion')
          .setPlaceholder('Lorem ipsum dolor sit amet.')
          .setMaxLength(300)
          .setMinLength(5)
          .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(suggestionInput);
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
      }

      if (interaction.customId === 'suggest-modal') {
        await interaction.deferReply({ ephemeral: true });

        const cooldown = Math.floor((Date.now() / 1000) + 5 * 60);
        const unix = Math.floor(Date.now() / 1000);

        const username = interaction.user.username;

        const suggestionSuccess = async () => {
          const channel = await interaction.client.channels.fetch('1143198750404268062');

          const embed = new EmbedBuilder()
            .setDescription(`> ${interaction.fields.getTextInputValue('suggestion')}\n\n||${interaction.user.username}||\n`)
            .setFooter({ text: 'Tip: Contact support if there are issues.' })
            .setColor('#2ecc71')

          const message = await channel.send({ content: '<@&1143197906371883079>', embeds: [embed] })
          const reactions = ['1086427881418280960', '1086425533161685093', '1143207753041592390'];
          reactions.forEach(async reaction => await message.react(reaction))

          await message.startThread({ name: 'Suggestion discussion' }).then(async () => {
            await interaction.followUp({ content: 'Your submission was received successfully!', ephemeral: true });
            console.log('Embed was sent.')
          });

          await db.collection('player-account').doc(interaction.guild.id)
            .set({ [username]: { 'cooldown': cooldown } }, { merge: true })
        }

        const suggestionFailure = async (cooldown) => {
          const embed = new EmbedBuilder()
            .setDescription(`Your suggestion is on cooldown!\nPlease wait for the timer below.\n\nReset in: <t:${cooldown}:R>`)
            .setFooter({ text: 'Tip: Contact support if there are issues.' })
            .setThumbnail('https://i.imgur.com/PCD2pG4.png')
            .setColor('#e67e22')

          await interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        const activeAccount = async ({ cooldown }) => {
          unix > cooldown
            ? suggestionSuccess()
            : suggestionFailure(cooldown)
        }

        const createAccount = async () => {
          await db.collection('player-account').doc(interaction.guild.id)
            .set({ [username]: { 'cooldown': cooldown } }, { merge: true })

          suggestionSuccess(username)
        }

        const reference = (await db.collection('player-account').doc(interaction.guild.id).get()).data()
        reference[username] ? activeAccount(reference[username]) : createAccount();
      }
    });
  },
};
