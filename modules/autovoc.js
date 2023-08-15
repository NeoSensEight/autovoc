/**
 * @author NeoSensEight
 * @description
 *      Fonctions pour gérer la suppression et la création des salons du plugin auto voc
 */


/*      IMPORTS      */
const { ChannelType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, VoiceState } = require('discord.js')
const { setupAutoVoc, voiceChannel } = require("../utils/enmapUtils");
const { color_embed,
		embed_footer_text, 
		embed_footer_icon,
		embed_author_name,
		embed_author_iconUrl,
		embed_author_url,
        default_userlimit } = require('../files/config');

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Supprime le salon vocal temporaire si il n'y a plus personne dedans
 * @param {VoiceState} oldstate 
 * @returns 
 */
async function deleteEmptyVoiceChannel(oldstate){
    
    //Si pas d'ancien voice channel on ne peut pas regarder le nombre de personne restante
    if(oldstate.channel===null) return
    
    //Si il reste au moins une personne dans le vocal
    if(oldstate.channel.members.size>0) return
    
    //Si le vocal était un des voice channel créée par le bot
    if(voiceChannel.get(oldstate.channelId)==null || voiceChannel.get(oldstate.channelId)==undefined) return

    oldstate.channel.delete()
        .then(voiceChannel.delete(oldstate.channelId))
        .catch(console.error);
}

/**
 * Créer un salon vocal temporaire quand une personne autorisée rejoins le salon configuré
 * @param {VoiceState} newstate 
 * @returns 
 */
async function createNewVoiceChannel(newstate){
    //Si le voice channel n'est pas dans la liste des salons pour l'auto voc 
    if(setupAutoVoc.get(newstate.channelId)==null || setupAutoVoc.get(newstate.channelId)==undefined) return

    //Création de salon
    const createdChan = await newstate.channel.parent.children.create({
        name : `Vocal de ${newstate.member.displayName}`,
        type : ChannelType.GuildVoice,
        parent : newstate.parent,
        userLimit : default_userlimit,
        position : 0,
    })
    .catch(console.error);
    newstate.member.voice.setChannel(createdChan)
    //Ajout du nouveau salon dans la base de données
    voiceChannel.set(createdChan.id, {
        ownerId : newstate.member.id,
        chanName : createdChan.name,
        chanLimit : createdChan.userLimit,
        chanCreationDate : Date.now(),
        chanBanUsers : [],
    });

    createdChan.send(`<@${newstate.member.id}>`).then(message => message.delete())

    let embed_text = `Merci à toi <@${newstate.member.id}>.
    
    __Ici, tu peux gérer ton salon vocal.
    Les commandes à dispositions sont les suivantes :__

    > -*Changer le nom du salon*
    > -*Changer le nombre de place dans le salon*
    > -*Ejecter et bloquer une personne du salon*
    > -*Autoriser une personne quand le salon est lock*
    > -*Lock le salon*
    > -*Unlock le salon*`

    //Création de l'embed d'affichage
	let embed_list = new EmbedBuilder()
        .setColor(color_embed)
        .setAuthor({ 
            name: embed_author_name, 
            iconURL: embed_author_iconUrl, 
            url: embed_author_url 
        })
        .setTitle(`Gestion de votre salon`)
        .setDescription(embed_text)
        .setFooter({
            text: embed_footer_text,
            iconURL : embed_footer_icon
        });
    const select = new StringSelectMenuBuilder()
        .setCustomId('Auto_Voc_Menu')
        .setPlaceholder('Choisit une option')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Nom')
                .setDescription('Changer le nom du salon vocal.')
                .setValue('autovoc_nom')
                .setEmoji('✏️'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Nombre de places')
                .setDescription('Définir le nombre de place disponible.')
                .setValue('autovoc_limit')
                .setEmoji('🔢'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Ejecter')
                .setDescription('Ejecter un membre.')
                .setValue('autovoc_reject')
                .setEmoji('❌'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Autoriser')
                .setDescription('Autoriser un membre.')
                .setValue('autovoc_permit')
                .setEmoji('✅'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Lock')
                .setDescription('Fermer le salon.')
                .setValue('autovoc_lock')
                .setEmoji('🔒'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Unlock')
                .setDescription('Ouvre le salon.')
                .setValue('autovoc_unlock')
                .setEmoji('🔓'),
        );
    
    const row = new ActionRowBuilder()
        .addComponents(select)

	// Envoyer dans le nouveau salon
	await createdChan.send({
		embeds: [embed_list],
        components : [row],
		ephemeral: true,
	});
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
    deleteEmptyVoiceChannel,
    createNewVoiceChannel,
}