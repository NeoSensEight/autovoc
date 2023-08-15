/**
 * @author NeoSensEight
 * @description
 *      Fonctions pour la gestion d'un salon temporaire
 */


/*      IMPORTS      */
const { PermissionsBitField, ActionRowBuilder, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, UserSelectMenuInteraction } = require("discord.js");
const { param_min_length_name_voc,
    param_max_length_name_voc,
    param_min_nb_user_select_ban,
    param_max_nb_user_select_ban,
    param_min_nb_user_select_perm,
    param_max_nb_user_select_perm } = require('../files/config')

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Changer le nom du salon
 * @param {import("discord.js").AnySelectMenuInteraction} interaction 
 * @param {Bot} client 
 */
async function autovocChangeName(interaction, client) {
    const modal = new ModalBuilder()
        .setCustomId('mod_changename')
        .setTitle('Gestion salon vocal');
    const newNameInput = new TextInputBuilder()
        .setCustomId('input_NewNameVoc')
        .setLabel('Choisir le nouveau nom du salon.')
        .setMinLength(param_min_length_name_voc)
        .setMaxLength(param_max_length_name_voc)
        .setPlaceholder('Nom du salon')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(newNameInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal)
}

/**
 * Changer la limite de place du salon
 * @param {import("discord.js").AnySelectMenuInteraction} interaction 
 * @param {Bot} client 
 */
async function autovocChangeLimit(interaction, client) {
    const modal = new ModalBuilder()
        .setCustomId('mod_changelimit')
        .setTitle('Gestion salon vocal');
    const newNameInput = new TextInputBuilder()
        .setCustomId('input_NewLimitVoc')
        .setLabel('Choisir le nombre de place pour le salon.')
        .setMinLength(1)
        .setMaxLength(2)
        .setPlaceholder('0 pour sans limite')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(newNameInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal)
}

/**
 * Ejecter et bannir des personnes du salon
 * @param {import("discord.js").AnySelectMenuInteraction} interaction 
 * @param {Bot} client 
 */
async function autovocReject(interaction, client) {
    const userSelect = new UserSelectMenuBuilder()
		.setCustomId('autovoc_banuser')
		.setPlaceholder('Select multiple users.')
		.setMinValues(param_min_nb_user_select_ban)
		.setMaxValues(param_max_nb_user_select_ban);

	const actionRow = new ActionRowBuilder()
		.setComponents(userSelect);

    interaction.reply({
        content : 'Sélectionner la ou les personnes à éjecter',
        components : [actionRow],
        ephemeral : true
    })

}

/**
 * Autoriser des personnes à rejoindre quand le salon est vérrouillé
 * @param {import("discord.js").AnySelectMenuInteraction} interaction 
 * @param {Bot} client 
 */
async function autovocPermit(interaction, client) {
    const userSelect = new UserSelectMenuBuilder()
		.setCustomId('autovoc_permituser')
		.setPlaceholder('Select multiple users.')
		.setMinValues(param_min_nb_user_select_perm)
		.setMaxValues(param_max_nb_user_select_perm);

	const actionRow = new ActionRowBuilder()
		.setComponents(userSelect);
    
    interaction.reply({
        content : 'Sélectionner la ou les personnes à autoriser',
        components : [actionRow],
        ephemeral : true
    })

}

/**
 * Vérrouiller le salon 
 * @param {import("discord.js").AnySelectMenuInteraction} interaction 
 * @param {Bot} client 
 */
async function autovocLock(interaction, client) {
    interaction.channel.permissionOverwrites.set([
        {
            id : interaction.guild.roles.everyone,
            deny :  [PermissionsBitField.Flags.Connect]
        },
        {
            id : interaction.member.id,
            allow :  [PermissionsBitField.Flags.Connect]
        }
    ],'Ferme le salon');

    interaction.reply({
        content : 'Salon vérrouillé avec succès',
        ephemeral : true
    })
}

/**
 * Dévérrouiller le salon
 * @param {import("discord.js").AnySelectMenuInteraction} interaction 
 * @param {Bot} client 
 */
async function autovocUnlock(interaction, client) {
    interaction.channel.permissionOverwrites.set([
        {
            id : interaction.guild.roles.everyone,
            allow :  [PermissionsBitField.Flags.Connect]
        }
    ],'Ouvre le salon');

    interaction.reply({
        content : 'Salon dévérrouillé avec succès',
        ephemeral : true
    })
}

/**
 * Change le nom du salon
 * @param {ModalSubmitInteraction} interaction 
 */
async function handleModalChangeName(interaction) {
    interaction.reply({ content : 'Nom changé avec succès', ephemeral: true });
    interaction.channel.setName(interaction.fields.getTextInputValue('input_NewNameVoc'));
}

/**
 * Change la limite de place du salon
 * @param {ModalSubmitInteraction} interaction 
 */
async function handleModalChangeLimit(interaction) {
    interaction.reply({ content : 'Nombre de place définit avec succès', ephemeral: true });
    interaction.channel.setUserLimit(interaction.fields.getTextInputValue('input_NewLimitVoc'));
}

/**
 * Ejecter et bannir les personnes du salon
 * @param {UserSelectMenuInteraction} interaction 
 */
async function handleSelectBan(interaction){
    interaction.values.forEach(user => {
        interaction.channel.permissionOverwrites.edit(user,{
            Connect : false
        })
    });
    interaction.reply({ content : 'Les personnes ont été éjectés avec succès', ephemeral: true });
}

/**
 * Autoriser les personnes à rejoindre le salon
 * @param {UserSelectMenuInteraction} interaction 
 */
async function handleSelectPermit(interaction){
    interaction.values.forEach(user => {
        interaction.channel.permissionOverwrites.edit(user,{
            Connect : true
        })
    });
    interaction.reply({ content : 'Les personnes ont été éjectés avec succès', ephemeral: true });
}


/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
    autovocChangeName,
    autovocChangeLimit,
    autovocReject,
    autovocPermit,
    autovocLock,
    autovocUnlock,
    handleModalChangeName,
    handleModalChangeLimit,
    handleSelectBan,
    handleSelectPermit
}