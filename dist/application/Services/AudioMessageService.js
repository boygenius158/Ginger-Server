"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageModel_1 = __importDefault(require("../../infrastructure/database/model/MessageModel"));
const UserService_1 = __importDefault(require("./UserService"));
class AudioMessageService {
    uploadAudio(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(data);
            const { recipientEmail, senderEmail, message, type } = data;
            const receiver = yield UserService_1.default.findUserIdWithEmail(recipientEmail);
            const sender = yield UserService_1.default.findUserIdWithEmail(senderEmail);
            // console.log(receiver, sender, "[][][");
            const document = new MessageModel_1.default({
                sender,
                receiver,
                message,
                type
            });
            yield document.save();
            return document;
        });
    }
}
exports.default = new AudioMessageService();
