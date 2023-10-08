const CustomError = require('./custom-errors');

function isValidStruct(struct) {
    if (!struct.agent) throw new CustomError("First layer properties not found", 400)

    if (struct.agent.active) {
        if (!struct.agent.handler) throw new CustomError("No handler container found", 400)
        if (!Array.isArray(struct.agent.handler)) throw new CustomError("Invalid handler container type", 400)
        if (!struct.agent.handler[0]) throw new CustomError("Handler cannot be empty", 400)

        for (let h in struct.agent.handler) {

            if (!struct.agent.handler[h].prompt || !struct.agent.handler[h].replys || !struct.agent.handler[h].interval || !struct.agent.handler[h].autoSaveToLists || !struct.agent.handler[h].autoSaveToContacts) throw new CustomError("Agent first layer properties not found", 400)
            if (typeof struct.agent.handler[h].prompt !== 'string') throw new CustomError("invalid handler prompt type", 400)
            if (typeof struct.agent.handler[h].interval !== 'number') throw new CustomError("Invalid handler interval type", 400)



            if (struct.agent.handler[h].autoSaveToContacts.active) {
                if (struct.agent.handler[h].autoSaveToContacts.prefix) {
                    if (typeof struct.agent.handler[h].autoSaveToContacts.prefix !== 'string') throw new CustomError("Invalid prefix type", 400)
                }
                if (struct.agent.handler[h].autoSaveToContacts.suffix) {
                    if (typeof struct.agent.handler[h].autoSaveToContacts.suffix !== 'string') throw new CustomError("Invalid suffix type", 400)
                }
            }


            if (struct.agent.handler[h].autoSaveToLists.active) {
                if (!struct.agent.handler[h].autoSaveToLists.lists) throw new CustomError("No list container", 400)
                if (!Array.isArray(struct.agent.handler[h].autoSaveToLists.lists)) throw new CustomError("Invalid list container type", 400)
                if (!struct.agent.handler[h].autoSaveToLists.lists[0]) throw new CustomError("No list found in container", 400)
                struct.agent.handler[h].autoSaveToLists.lists.forEach(list => {
                    if (typeof list !== 'string') throw new CustomError("Invalid list type", 400)
                });
            }


            if (!Array.isArray(struct.agent.handler[h].replys)) throw new CustomError("Invalid handler replys container type", 400)
            if (!struct.agent.handler[h].replys[0]) throw new CustomError("Replys container is empty", 400)

            for (let r in struct.agent.handler[h].replys) {

                if (struct.agent.handler[h].replys[r].type === "P" || struct.agent.handler[h].replys[r].type === "V" || struct.agent.handler[h].replys[r].type === "A") {
                    if (!struct.agent.handler[h].replys[r].link) throw new CustomError("Required content for reply type not found", 400)
                } else if (struct.agent.handler[h].replys[r].type === "CP" || struct.agent.handler[0].replys[0].type === "CV") {
                    if (!struct.agent.handler[h].replys[r].link) throw new CustomError("Required content for reply type not found", 400)
                    if (!struct.agent.handler[h].replys[r].caption) throw new CustomError("Required content for reply type not found", 400)
                } else if (struct.agent.handler[h].replys[r].type === "T") {
                    if (!struct.agent.handler[h].replys[r].text) throw new CustomError("Required content for reply type not found", 400)
                } else {
                    throw new CustomError("Invalid reply type", 400)
                }

            }

        }

    }

    return true
}


module.exports = { isValidStruct }