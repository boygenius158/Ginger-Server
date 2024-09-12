import Message from "../../infrastructure/database/model/MessageModel"
import UserService from "./UserService";


class AudioMessageService {
    async uploadAudio(data: any) {
        // console.log(data);
        const { recipientEmail, senderEmail, message, type } = data
        const receiver = await UserService.findUserIdWithEmail(recipientEmail)
        const sender = await UserService.findUserIdWithEmail(senderEmail)
        // console.log(receiver, sender, "[][][");

        const document = new Message({
            sender,
            receiver,
            message,
            type
        })

        await document.save()

        return document




    }

}

export default new AudioMessageService()