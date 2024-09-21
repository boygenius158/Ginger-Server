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
exports.setupSocketIO = setupSocketIO;
const socket_io_1 = require("socket.io");
const UserModel_1 = __importDefault(require("../../infrastructure/database/model/UserModel"));
const MessageModel_1 = __importDefault(require("../../infrastructure/database/model/MessageModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const PostModel_1 = require("../../infrastructure/database/model/PostModel");
const NotificationModel_1 = require("../../infrastructure/database/model/NotificationModel");
const MatchService_1 = __importDefault(require("../../application/Services/MatchService"));
const UserService_1 = __importDefault(require("../../application/Services/UserService"));
const AudioMessageService_1 = __importDefault(require("../../application/Services/AudioMessageService"));
function setupSocketIO(server) {
    console.log("socket connected");
    function findSocketWithEmail(email) {
        return users[email];
    }
    const users = {};
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'https://gingerfrontend.vercel.app/',
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization"],
            credentials: true, // if you need to allow cookies or other credentialsddd
        }
    });
    io.on('connection', (socket) => {
        // console.log("User has connected:", `${socket.id}`);
        socket.on('register', (userEmail) => {
            console.log("registered", userEmail);
            users[userEmail] = socket.id;
        });
        socket.on('message', (_a) => __awaiter(this, [_a], void 0, function* ({ recipientEmail, senderEmail, message, type }) {
            console.log(recipientEmail, message, senderEmail, type);
            try {
                const senderUser = yield UserModel_1.default.findOne({ email: senderEmail });
                const receiverUser = yield UserModel_1.default.findOne({ email: recipientEmail });
                if (senderUser && receiverUser) {
                    const newMessage = new MessageModel_1.default({
                        sender: senderUser._id,
                        receiver: receiverUser._id,
                        type: type,
                        message: message,
                        timestamp: new Date(),
                        isRead: false
                    });
                    const savedMessage = yield newMessage.save();
                    console.log("Message saved to database successfully:", savedMessage);
                    const targetSocketId = findSocketWithEmail(recipientEmail);
                    const senderSocketId = findSocketWithEmail(senderEmail);
                    console.log("target", targetSocketId, "sender", senderSocketId);
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('receive_message', savedMessage);
                    }
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('receive_message', savedMessage);
                    }
                }
                else {
                    console.error("Sender or recipient user not found.");
                }
            }
            catch (error) {
                console.error("Error handling message:", error);
            }
        }));
        socket.on('notification', (_a) => __awaiter(this, [_a], void 0, function* ({ user, type, originalUser, postId }) {
            var _b;
            console.log("1", user, "2", type, "3", originalUser, "4", postId);
            try {
                // Ensure `postId` and `originalUser` are correctly converted to `ObjectId`
                const OpostId = new mongoose_1.default.Types.ObjectId(postId);
                const OoriginalUser = new mongoose_1.default.Types.ObjectId(originalUser);
                // Find the user who liked the post
                const userWhoLikePost = yield UserModel_1.default.findById(OoriginalUser);
                // Find the post by `postId`
                const post = yield PostModel_1.PostModel.findById(OpostId);
                if (!post) {
                    console.error('Post not found');
                    return;
                }
                // Check if the user has liked the post
                const hasLiked = (_b = post.likes) === null || _b === void 0 ? void 0 : _b.includes(OoriginalUser);
                // Make sure the post exists and compare the `userId` with `originalUser`
                if (post.userId.toString() !== OoriginalUser.toString()) {
                    // Determine the message based on the like status
                    const message = hasLiked
                        ? `${(userWhoLikePost === null || userWhoLikePost === void 0 ? void 0 : userWhoLikePost.username) || 'Someone'} liked your post`
                        : `${(userWhoLikePost === null || userWhoLikePost === void 0 ? void 0 : userWhoLikePost.username) || 'Someone'} unliked your post`;
                    // Create and save the notification
                    const notification = new NotificationModel_1.Notification({
                        user: post.userId,
                        interactorId: userWhoLikePost === null || userWhoLikePost === void 0 ? void 0 : userWhoLikePost._id,
                        type: 'like',
                        message: message,
                    });
                    yield notification.save();
                    const post2 = yield PostModel_1.PostModel.findById(OpostId).populate('userId');
                    const user = yield UserModel_1.default.findById(post2 === null || post2 === void 0 ? void 0 : post2.userId);
                    console.log("post2", user);
                    if (!user) {
                        throw new Error('hey no user found');
                    }
                    const toSocketId = findSocketWithEmail(user === null || user === void 0 ? void 0 : user.email);
                    console.log(toSocketId, "toSocketId");
                    io.to(toSocketId).emit('notification', notification);
                    const notifications2 = yield NotificationModel_1.Notification.findOne({ user: post.userId })
                        .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest
                        .populate('interactorId', 'username profilePicture') // Populate interactorId with specific fields
                        .exec();
                    io.to(toSocketId).emit('notification_stack', notifications2);
                    if (toSocketId) {
                        console.log("socket id exist");
                    }
                    else {
                        console.log("socket id not found");
                    }
                }
            }
            catch (error) {
                console.error('Error handling notification:', error);
            }
        }));
        socket.on('call', (callee, caller) => __awaiter(this, void 0, void 0, function* () {
            console.log(caller, "calling ...");
            const calleeSocketId = findSocketWithEmail(callee);
            const callerSocketId = findSocketWithEmail(caller);
            // console.log(calleeSocketId,);
            const userdetails = yield UserService_1.default.findUserDetailsWithEmail(caller);
            console.log(userdetails, "lop", caller);
            io.to(calleeSocketId).emit('user_calling', userdetails);
        }));
        socket.on('offer', (offer, email) => {
            console.log(socket.id, "socketid");
            let targetSocketId = findSocketWithEmail(email);
            console.log(targetSocketId, "email found", email);
            io.to(targetSocketId).emit('offer', offer);
            // socket.to()
        });
        socket.on('answer', (answer, email) => {
            console.log('answer', "socketid", socket.id, 'mail', email);
            let targetSocketId = findSocketWithEmail(email);
            console.log(targetSocketId, "found");
            io.to(targetSocketId).emit('answer', answer);
        });
        socket.on('ice-candidate', (candidate, email) => {
            let targetSocketId = findSocketWithEmail(email);
            io.to(targetSocketId).emit('ice-candidate', candidate);
        });
        // socket.on('call_notification', (email: string) => {
        //   let targetSocketId = findSocketWithEmail(email)
        //   console.log(email);
        //   io.to(targetSocketId).emit('caller_notification', "hello world")s
        // })
        socket.on('onlineStatus', (recipient, sender) => {
            console.log(recipient, "onlineStatus");
            let socketFound = findSocketWithEmail(recipient);
            console.log(socketFound, "socketFound");
            let targetSocketId = findSocketWithEmail(sender);
            if (socketFound) {
                console.log("socket exist");
                io.to(targetSocketId).emit('statusOnline', true);
            }
            else {
                console.log("socket doesnt exist");
                io.to(targetSocketId).emit('statusOnline', false);
            }
        });
        socket.on('force-logout', (email) => {
            let targetSocketId = findSocketWithEmail(email);
            if (!targetSocketId) {
                console.error(`No socket found for email: ${email}`);
                return; // Exit if no valid socket ID is found
            }
            console.log("Email of socket:", email);
            console.log("Socket ID to target:", targetSocketId);
            try {
                io.to(targetSocketId).emit('force-logout2');
                console.log(`Sent 'force-logout2' to socket ID: ${targetSocketId}`);
            }
            catch (error) {
                console.error(`Failed to send 'force-logout2' to socket ID: ${targetSocketId}`, error);
            }
        });
        // socket.on('audio-chat', ({ recipientEmail, senderEmail, message, type }) => {
        //   console.log(message, "message", type, "type");
        //   console.log("audio chat90000", senderEmail);
        //   let targetSocketId = findSocketWithEmail(recipientEmail);
        //   if (targetSocketId) console.log(true, "099");
        //   io.to(targetSocketId).emit('audio-chat')
        // })
        socket.on('audio-chat', (_a) => __awaiter(this, [_a], void 0, function* ({ recipientEmail, senderEmail, message, type }) {
            const data = {
                recipientEmail,
                senderEmail,
                message,
                type
            };
            const audioMessage = yield AudioMessageService_1.default.uploadAudio(data);
            console.log(audioMessage, "tiff");
            let targetSocketId = findSocketWithEmail(recipientEmail);
            let ownerSocketId = findSocketWithEmail(senderEmail);
            console.log(targetSocketId, "77777");
            io.to(targetSocketId).emit('audio-chat-return', audioMessage);
            io.to(ownerSocketId).emit('audio-chat-return', audioMessage);
        }));
        socket.on('disconnectUser', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Find the email associated with this socket ID and remove it from the `users` object
            for (const [email, socketId] of Object.entries(users)) {
                if (socketId === socket.id) {
                    delete users[email];
                    console.log(`Removed ${email} from users list.`);
                    break;
                }
            }
        });
        socket.on('swipe', (_a) => __awaiter(this, [_a], void 0, function* ({ profile, userId }) {
            console.log(profile.userId, "swiped by user", userId);
            const match = yield MatchService_1.default.handleSwipe(userId, profile.userId);
            console.log(match);
            if (match) {
                console.log("its a match");
                //user-1
                const user1Email = yield UserService_1.default.findEmailWithUserId(userId);
                const user2Email = yield UserService_1.default.findEmailWithUserId(profile.userId);
                if (!user1Email || !user2Email) {
                    throw new Error("One or both users do not have a registered email.");
                }
                const user1SocketId = findSocketWithEmail(user1Email);
                const user2SocketId = findSocketWithEmail(user2Email);
                io.to(user1SocketId).emit('match', "its a match");
                io.to(user2SocketId).emit('match', "its a match");
            }
        }));
        socket.on('match_owner', (_a) => __awaiter(this, [_a], void 0, function* ({ userId }) {
            console.log(userId, "yuu");
            const user = yield UserService_1.default.findDatingProfile(userId);
            const userEmail = yield UserService_1.default.findEmailWithUserId(userId);
            if (!user || !userEmail) {
                throw new Error;
            }
            console.log(user, "][=09987");
            io.to(findSocketWithEmail(userEmail)).emit('profile-image', user.images[0]);
        }));
        socket.on('ImageMessage', (_a) => __awaiter(this, [_a], void 0, function* ({ recipientEmail, senderEmail, message, type }) {
            console.log(recipientEmail, message, senderEmail);
            try {
                const senderUser = yield UserModel_1.default.findOne({ email: senderEmail });
                const receiverUser = yield UserModel_1.default.findOne({ email: recipientEmail });
                if (senderUser && receiverUser) {
                    const newMessage = new MessageModel_1.default({
                        sender: senderUser._id,
                        receiver: receiverUser._id,
                        type: type,
                        message: message,
                        timestamp: new Date(),
                        isRead: false
                    });
                    const savedMessage = yield newMessage.save();
                    console.log("Message saved to database successfully:", savedMessage);
                    const targetSocketId = findSocketWithEmail(recipientEmail);
                    const senderSocketId = findSocketWithEmail(senderEmail);
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('receive_message', savedMessage);
                    }
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('receive_message', savedMessage);
                    }
                }
                else {
                    console.error("Sender or recipient user not found.");
                }
            }
            catch (error) {
                console.error("Error handling message:", error);
            }
        }));
    });
}
// console.log(users);
