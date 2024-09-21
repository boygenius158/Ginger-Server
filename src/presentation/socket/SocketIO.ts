import { Server } from "socket.io";
import UserModel from "../../infrastructure/database/model/UserModel";
import Message from "../../infrastructure/database/model/MessageModel";
import mongoose from "mongoose";
import { PostModel } from "../../infrastructure/database/model/PostModel";
import { Notification } from "../../infrastructure/database/model/NotificationModel";
import MatchService from "../../application/Services/MatchService";
import UserService from "../../application/Services/UserService";
import AudioMessageService from "../../application/Services/AudioMessageService";



export function setupSocketIO(server: any) {
  console.log("socket connected");

  function findSocketWithEmail(email: string) {
    return users[email];
  }

  const users: {
    [key: string]: string;
  } = {};

  const io = new Server(server, {
    cors: {
      origin: 'https://gingerfrontend.vercel.app',
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

    socket.on('message', async ({ recipientEmail, senderEmail, message, type }) => {
      console.log(recipientEmail, message, senderEmail, type);

      try {
        const senderUser = await UserModel.findOne({ email: senderEmail });
        const receiverUser = await UserModel.findOne({ email: recipientEmail });

        if (senderUser && receiverUser) {
          const newMessage = new Message({
            sender: senderUser._id,
            receiver: receiverUser._id,
            type: type,
            message: message,
            timestamp: new Date(),
            isRead: false
          });

          const savedMessage = await newMessage.save();
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

        } else {
          console.error("Sender or recipient user not found.");
        }

      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on('notification', async ({ user, type, originalUser, postId }) => {
      console.log("1", user, "2", type, "3", originalUser, "4", postId);

      try {
        // Ensure `postId` and `originalUser` are correctly converted to `ObjectId`
        const OpostId = new mongoose.Types.ObjectId(postId);
        const OoriginalUser = new mongoose.Types.ObjectId(originalUser);

        // Find the user who liked the post
        const userWhoLikePost = await UserModel.findById(OoriginalUser);

        // Find the post by `postId`
        const post = await PostModel.findById(OpostId);

        if (!post) {
          console.error('Post not found');
          return;
        }

        // Check if the user has liked the post

        const hasLiked = post.likes?.includes(OoriginalUser);

        // Make sure the post exists and compare the `userId` with `originalUser`
        if (post.userId.toString() !== OoriginalUser.toString()) {

          // Determine the message based on the like status
          const message = hasLiked
            ? `${userWhoLikePost?.username || 'Someone'} liked your post`
            : `${userWhoLikePost?.username || 'Someone'} unliked your post`;

          // Create and save the notification
          const notification = new Notification({
            user: post.userId,
            interactorId: userWhoLikePost?._id,
            type: 'like',
            message: message,
          });

          await notification.save();
          const post2 = await PostModel.findById(OpostId).populate('userId');
          const user = await UserModel.findById(post2?.userId)
          console.log("post2", user);
          if (!user) {
            throw new Error('hey no user found')
          }
          const toSocketId = findSocketWithEmail(user?.email);
          console.log(toSocketId, "toSocketId");

          io.to(toSocketId).emit('notification', notification);
          const notifications2 = await Notification.findOne({ user: post.userId })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest
            .populate('interactorId', 'username profilePicture') // Populate interactorId with specific fields
            .exec();


          io.to(toSocketId).emit('notification_stack', notifications2)

          if (toSocketId) {
            console.log("socket id exist");

          } else {
            console.log("socket id not found")
          }

        }
      } catch (error) {
        console.error('Error handling notification:', error);
      }
    });


    socket.on('call', async (callee, caller) => {
      console.log(caller, "calling ...");
      const calleeSocketId = findSocketWithEmail(callee)
      const callerSocketId = findSocketWithEmail(caller)
      // console.log(calleeSocketId,);
      const userdetails = await UserService.findUserDetailsWithEmail(caller)
      console.log(userdetails, "lop", caller,);


      io.to(calleeSocketId).emit('user_calling', userdetails)

    })

    socket.on('offer', (offer, email) => {
      console.log(socket.id, "socketid");
      let targetSocketId = findSocketWithEmail(email)
      console.log(targetSocketId, "email found", email);
      io.to(targetSocketId).emit('offer', offer)
      // socket.to()
    })
    socket.on('answer', (answer, email) => {
      console.log('answer', "socketid", socket.id, 'mail', email);
      let targetSocketId = findSocketWithEmail(email)
      console.log(targetSocketId, "found");




      io.to(targetSocketId).emit('answer', answer)


    })

    socket.on('ice-candidate', (candidate, email) => {

      let targetSocketId = findSocketWithEmail(email)

      io.to(targetSocketId).emit('ice-candidate', candidate)

    })

    // socket.on('call_notification', (email: string) => {
    //   let targetSocketId = findSocketWithEmail(email)
    //   console.log(email);
    //   io.to(targetSocketId).emit('caller_notification', "hello world")s

    // })

    socket.on('onlineStatus', (recipient, sender) => {
      console.log(recipient, "onlineStatus");
      let socketFound = findSocketWithEmail(recipient)
      console.log(socketFound, "socketFound");
      let targetSocketId = findSocketWithEmail(sender)

      if (socketFound) {
        console.log("socket exist");
        io.to(targetSocketId).emit('statusOnline', true)

      } else {
        console.log("socket doesnt exist");
        io.to(targetSocketId).emit('statusOnline', false)


      }

    })

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
      } catch (error) {
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
    socket.on('audio-chat', async ({ recipientEmail, senderEmail, message, type }) => {
      const data = {
        recipientEmail,
        senderEmail,
        message,
        type
      }
      const audioMessage = await AudioMessageService.uploadAudio(data)
      console.log(audioMessage, "tiff");
      let targetSocketId = findSocketWithEmail(recipientEmail);
      let ownerSocketId = findSocketWithEmail(senderEmail)
      console.log(targetSocketId, "77777");

      io.to(targetSocketId).emit('audio-chat-return', audioMessage)
      io.to(ownerSocketId).emit('audio-chat-return', audioMessage)
    })
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

    socket.on('swipe', async ({ profile, userId }) => {
      console.log(profile.userId, "swiped by user", userId);

      const match = await MatchService.handleSwipe(userId, profile.userId)
      console.log(match);
      if (match) {
        console.log("its a match");

        //user-1
        const user1Email = await UserService.findEmailWithUserId(userId)
        const user2Email = await UserService.findEmailWithUserId(profile.userId)
        if (!user1Email || !user2Email) {
          throw new Error("One or both users do not have a registered email.");
        }
        const user1SocketId = findSocketWithEmail(user1Email)
        const user2SocketId = findSocketWithEmail(user2Email)
        io.to(user1SocketId).emit('match', "its a match")
        io.to(user2SocketId).emit('match', "its a match")
      }



    });

    socket.on('match_owner', async ({ userId }) => {
      console.log(userId, "yuu");
      const user = await UserService.findDatingProfile(userId)
      const userEmail = await UserService.findEmailWithUserId(userId)
      if (!user || !userEmail) {
        throw new Error
      }
      console.log(user, "][=09987");
      io.to(findSocketWithEmail(userEmail)).emit('profile-image', user.images[0])


    })

    socket.on('ImageMessage', async ({ recipientEmail, senderEmail, message, type }) => {
      console.log(recipientEmail, message, senderEmail);

      try {
        const senderUser = await UserModel.findOne({ email: senderEmail });
        const receiverUser = await UserModel.findOne({ email: recipientEmail });

        if (senderUser && receiverUser) {
          const newMessage = new Message({
            sender: senderUser._id,
            receiver: receiverUser._id,
            type: type,
            message: message,
            timestamp: new Date(),
            isRead: false
          });

          const savedMessage = await newMessage.save();
          console.log("Message saved to database successfully:", savedMessage);

          const targetSocketId = findSocketWithEmail(recipientEmail);
          const senderSocketId = findSocketWithEmail(senderEmail);

          if (targetSocketId) {
            io.to(targetSocketId).emit('receive_message', savedMessage);
          }

          if (senderSocketId) {
            io.to(senderSocketId).emit('receive_message', savedMessage);
          }

        } else {
          console.error("Sender or recipient user not found.");
        }

      } catch (error) {
        console.error("Error handling message:", error);
      }

    })
  });
}

// console.log(users);


