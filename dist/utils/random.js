"use strict";
// socket.on('call', (email, callerSocketId) => {
//     console.log(`${email} is being called by ${callerSocketId}`);
//     // Find the socket ID of the target user
//     let targetSocketId = findSocketWithEmail(email);
//     if (targetSocketId) {
//       // Emit an event to the target user asking them to accept or reject the call
//       io.to(targetSocketId).emit('incoming-call', {
//         from: callerSocketId,
//         email: email
//       });
//     } else {
//       console.log(`User with email ${email} not found`);
//     }
//   });
//   socket.on('call-response', (response, email) => {
//     console.log(`Call response from ${email}: ${response}`);
//     let targetSocketId = findSocketWithEmail(email);
//     if (response === 'accept') {
//       // The user accepted the call, proceed with the WebRTC offer/answer exchange
//       io.to(targetSocketId).emit('call-accepted', socket.id);
//     } else {
//       // The user rejected the call, notify the caller
//       io.to(targetSocketId).emit('call-rejected', socket.id);
//     }
//   });
//   socket.on('offer', (offer, email) => {
//     console.log(socket.id, "socketid");
//     let targetSocketId = findSocketWithEmail(email);
//     console.log(targetSocketId, "email found", email);
//     io.to(targetSocketId).emit('offer', offer);
//   });
//   socket.on('answer', (answer, email) => {
//     console.log('answer', "socketid", socket.id, 'mail', email);
//     let targetSocketId = findSocketWithEmail(email);
//     console.log(targetSocketId, "found");
//     io.to(targetSocketId).emit('answer', answer);
//   });
//   socket.on('ice-candidate', (candidate, email) => {
//     let targetSocketId = findSocketWithEmail(email);
//     io.to(targetSocketId).emit('ice-candidate', candidate);
//   });
