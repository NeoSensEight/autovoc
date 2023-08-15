/**
 * @author NeoSensEight
 * @description
 *      Contient la commande 'liste_autovoc'.
 *      Liste les salons vocaux configurés sur le serveur.
 */

const { EmbedBuilder } = require('discord.js');
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
	.setName("liste_autovoc")
	.setDescription('Liste les vocaux configuré sur le serveur');

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Fonction appelé quand la commande est 'liste_autovoc'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */
async function execute(interaction, client) {

	let embed_text = '__**Liste : **__';

	//Recherche les salons configurés pour le serveur
	setupAutoVoc.forEach((values, key, map) => {
		if(values.guild == interaction.guild.id){
			embed_text+=`
			<#${key}>`;
		}
	});

	//Si pas de salon configuré pour le serveur
	if(embed_text.length==16) embed_text+=` 
	*Aucun*`;
	
	//Création de l'embed d'affichage
	let embed_list = new EmbedBuilder()
        .setColor(color_embed)
		.setAuthor({ 
			name: embed_author_name, 
			iconURL: embed_author_iconUrl, 
			url: embed_author_url 
		})
        .setTitle('Liste des salons vocaux configurés')
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
	});
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
	data: slashCommand,
	execute,
};
