/**
 * @author Lothaire Guée
 * @description
 *		This event is used to store the memes in the database and add their initial reactions.
 */

const { VoiceState, ChannelType, PermissionFlagsBits } = require("discord.js");
const { setupAutoVoc, voiceChannel } = require("../utils/enmapUtils");
const { exists } = require("i18next");
const { deleteEmptyVoiceChannel, createNewVoiceChannel } = require('../modules/autovoc.js')

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */

/**
 * Function called when the event 'voiceStateUpdate' is emitted.
 * @param {VoiceState} oldstate The message created.
 * @param {VoiceState} newstate The client that emitted the event.
 */
async function execute(oldstate, newstate) {
    deleteEmptyVoiceChannel(oldstate);
    createNewVoiceChannel(newstate);
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
    name: "voiceStateUpdate",
    execute,
};
