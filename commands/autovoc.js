/**
 * @author NeoSensEight
 * @description
 *      Contient la commande 'autovoc'.
 *      Permet de configurer un salon vocal pour la création de salons vocaux automatique.
 *      Le système peut être limité à 1 rôle définit lors de la création.
 */

const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { setupAutoVoc } = require("../utils/enmapUtils");
const { color_embed,
		embed_footer_text, 
		embed_footer_icon,
		embed_author_name,
		embed_author_iconUrl,
		embed_author_url,
		embed_title_url,
		embed_thumbnail } = require('../files/config');

/* ----------------------------------------------- */
/* COMMAND BUILD                                   */
/* ----------------------------------------------- */
const slashCommand = new SlashCommandBuilder()
	.setName("autovoc")
    .setDescription("Définir ce channel pour le vote automatique des emojis.")
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Choisir le salon vocal')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice))
    .addRoleOption(option =>
        option
            .setName('role_access')
            .setDescription('Choisir le rôle autorisé')
            .setRequired(false))

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Fonction appelé quand la commande est 'color'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */
async function execute(interaction, client) {

    let embed_text

	//console.log(interaction.options.getRole('autovoc_setup_role'))
    if (setupAutoVoc.get(interaction.options.getChannel('channel').id) === undefined) {
        setupAutoVoc.set(interaction.options.getChannel('channel').id, {
            active : true,
            guild : interaction.guild.id,
            role : interaction.options.getRole('role_access') === null ? 0 : interaction.options.getRole('role_access').id,
        });
        if(interaction.options.getRole('role_access') === null) {
            interaction.options.getChannel('channel').permissionOverwrites.set([
                { id : interaction.guild.roles.everyone, allow :  [PermissionsBitField.Flags.ViewChannel] }
            ],'Bloquer le salon pour tout le monde sauf le rôle autorisé')
        } else {
            interaction.options.getChannel('channel').permissionOverwrites.set([
                { id : interaction.guild.roles.everyone, deny :  [PermissionsBitField.Flags.ViewChannel] },
                { id : interaction.options.getRole('role_access').id, allow :  [PermissionsBitField.Flags.ViewChannel] }
            ],'Bloquer le salon pour tout le monde sauf le rôle autorisé')
        }
        

        embed_text=`Le salon ${interaction.options.getChannel('channel')} à été ajouté pour l'auto_voc !`
    } else {
        setupAutoVoc.delete('941635183331917834');
        setupAutoVoc.delete(interaction.options.getChannel('channel').id);

        embed_text=`Le salon ${interaction.options.getChannel('channel')} à été supprimé pour l'auto_voc !`
    }

    //Création de l'embed d'affichage
	let embed_list = new EmbedBuilder()
    .setColor(color_embed)
    .setAuthor({ 
        name: embed_author_name, 
        iconURL: embed_author_iconUrl, 
        url: embed_author_url 
    })
    .setTitle(`Configuration d'un salon vocal`)
    .setThumbnail(embed_thumbnail)
    .setDescription(embed_text)
    .setFooter({
        text: embed_footer_text,
        iconURL : embed_footer_icon
    });

	//Message de réponse éphémère en embed 
	await interaction.reply({
		embeds: [embed_list],
		ephemeral: true,
	})
    .catch(console.error);
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
	data: slashCommand,
	execute,
};
