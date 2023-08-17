/**
 * @author Lothaire Guée
 * @description
 *		It manage the slash commands.
 */

const { InteractionType } = require("discord.js");
const { setupAutoVoc, voiceChannel } = require("../utils/enmapUtils");
const { autovocChangeName, autovocChangeLimit, autovocReject, autovocPermit, autovocLock, autovocUnlock, handleModalChangeName, handleModalChangeLimit, handleSelectBan, handleSelectPermit } = require("../modules/interactions");

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * The handler for the event 'interactionCreate'.
 * It is called whenever an interaction is created.
 * It can be a button pressed, a slash command executed, etc.
 * @param {CommandInteraction} interaction The interaction that triggered the event.
 * @param {Client} client The client that created the interaction.
 */
function execute(interaction, client) {
    if(voiceChannel.get(interaction.channelId)===undefined || voiceChannel.get(interaction.channelId)===null) return;
    if(!(voiceChannel.get(interaction.channelId).ownerId == interaction.member.id)) return;
    if (interaction.type === InteractionType.MessageComponent) {
        if (interaction.values[0] === "autovoc_nom") {
            autovocChangeName(interaction, client);
        }
        if (interaction.values[0] === "autovoc_limit") {
            autovocChangeLimit(interaction, client);
        }
        if (interaction.values[0] === "autovoc_reject") {
            autovocReject(interaction, client);
        }
        if (interaction.values[0] === "autovoc_permit") {
            autovocPermit(interaction, client);
        }
        if (interaction.values[0] === "autovoc_lock") {
            autovocLock(interaction, client);
        }
        if (interaction.values[0] === "autovoc_unlock") {
            autovocUnlock(interaction, client);
        }
        
    }

    
    if (interaction.customId === "autovoc_banuser") handleSelectBan(interaction);
    if (interaction.customId === "autovoc_permituser") handleSelectPermit(interaction);
    
    if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === "mod_changename") handleModalChangeName(interaction);
        if (interaction.customId === "mod_changelimit") handleModalChangeLimit(interaction);
    }
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
    name: "interactionCreate",
    execute,
};
