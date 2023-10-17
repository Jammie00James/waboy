// // const qrcode = require('qrcode-terminal');

// // const { Client, RemoteAuth } = require('whatsapp-web.js');
// // const { MongoStore } = require('wwebjs-mongo');
// // const mongoose = require('mongoose');

// // async function createClient(clientId, prompts, store) {
// //   console.log("018")
// //   const client = new Client({
// //     authStrategy: new RemoteAuth({
// //       clientId: clientId,
// //       store: store,
// //       backupSyncIntervalMs: 600000
// //     })
// //   })
// //   // Handle events and authentication here
// //   client.on('qr', qr => {
// //     console.log("013")
// //     qrcode.generate(qr, { small: true });
// //   });

// //   client.on('ready', () => {
// //     console.log('Client ' + clientId + ' is ready!');
// //   });

// //   client.on('remote_session_saved', () => {
// //     console.log("Remote session saved")
// //   })


// //   client.on("message", message => {
// //     console.log(clientId + ' New Message : ' + message.body + " " + message.from);
// //     prompts.forEach(element => {
// //       if (message.body == element.prompt)
// //         message.reply(element.reply);
// //     });
// //   })

// //   await client.initialize();
// //   console.log("09")

// //   return client;
// // }


// // async function main() {

// //   let prompts = [{ prompt: "hello goodmorning", reply: "same here morning" }, { prompt: "hello goodafternoon", reply: "same here afternoon" }, { prompt: "hello goodevening", reply: "same here evening" }]
// //   mongoose.connect("").then(async () => {
// //     console.log("01")
// //     let store = new MongoStore({ mongoose: mongoose });
// //     // console.log("012")
// //     // let tester = await createClient("client2", prompts, store)
// //     // let tester2 = await createClient("client1", prompts, store)
// //   });


// //   // tester.sendMessage('2348101083890@c.us', 'brodcast message example').then((message) => {
// //   //   console.log('Message sent successfully:');
// //   // }).catch((error) => {
// //   //   console.error('Error sending message:', error);
// //   // });

// // }

// // const struct = {
// //   body: {
// //     agent: {
// //       active: true,
// //       handler: [
// //         {
// //           prompt: "Good morning",
// //           replys: [
// //             {
// //               type: "CP",
// //               text: null,
// //               link: "https://myphotolink.file",
// //               caption: "Hello, this is my picture"
// //             },
// //             {
// //               type: "CP",
// //               text: null,
// //               link: "https://myphotolink.file",
// //               caption: "Hello, this is my picture"
// //             }
// //           ],
// //           interval: 5
// //         },
// //         {
// //           prompt: "Good afternoon",
// //           replys:[
// //             {
// //               type: "V",
// //               text: null,
// //               link: "https://myphotolink.file",
// //               caption: null
// //             }
// //           ]
// //         },
// //         {
// //           prompt: "Good morning",
// //           replys: [
// //             {
// //               type: "V",
// //               text: null,
// //               link: "https://myphotolink.file",
// //               caption: null
// //             }
// //           ]
// //         }
// //       ]
// //     },
// //     autoSaveToContacts: {
// //       active: true,
// //       prefix: "Camp1",
// //       suffix: ""
// //     },
// //     autoSaveToLists: {
// //       active: true,
// //       lists: [
// //         "list0019883hehd",
// //         "list0028726783839399"
// //       ]
// //     }
// //   }
// // }

// // main()











// // // body:{
// // //   {bot:
// // //   {active:true,
// // //     handler:
// // //     [
// // //       {prompt:"Good morning",reply:{type:"CP",text:null,link:"https://myphotolink.file",caption:"Hello this is my picture"}},
// // //       {prompt:"Good afternoon",reply:{type:"V",text:null,link:"https://myphotolink.file",caption:null}},
// // //       {prompt:"Good morning",reply:{type:"T",text:"This is my example text",link: null,caption:null}}
// // //     ],
// // //     interval:5
// // //   },
// // //   autoSaveToContacts:{
// // //     active:true,
// // //     prefix:"Camp1",
// // //     suffix:""
// // //   },
// // //   autoSaveToLists:{
// // //     active:true,
// // //     lists:["list0019883hehd","list0028726783839399"]

// // //   }
// // //   }
// // // }

// const struct = {
//   agent: {
//     active: true,
//     handler: [
//       {
//         prompt: "Good morning",
//         replys: [
//           {
//             type: "CP",
//             text: "dhjhd jdh",
//             link: "https://myphotolink.file",
//             caption: "Hello, this is my picture"
//           },
//           {
//             type: "CP",
//             text: null,
//             link: "https://myphotolink.file",
//             caption: "Hello, this is my picture"
//           }
//         ],
//         interval: 5,
//         autoSaveToLists: {
//           active: true,
//           lists: [
//             "list0019883hehd",
//             "list0028726783839399"
//           ]
//         },
//         autoSaveToContacts: {
//           active: true,
//           prefix: "pre",
//           suffix: ""
//         }
//       },
//       {
//         prompt: "Good afternoon",
//         replys: [
//           {
//             type: "V",
//             text: null,
//             link: "https://myphotolink.file",
//             caption: null
//           }
//         ],
//         interval: 3,
//         autoSaveToLists: {
//           active: true,
//           lists: [
//             "list0019883hehd",
//             "list0028726783839399"
//           ]
//         },
//         autoSaveToContacts: {
//           active: true,
//           prefix: "pre",
//           suffix: ""
//         }
//       },
//       {
//         prompt: "Good morning",
//         replys: [
//           {
//             type: "T",
//             text: "Happy",
//             // link: "https://myphotolink.file",
//             caption: null
//           }
//         ],
//         interval: 3,
//         autoSaveToLists: {
//           active: true,
//           lists: [
//             "list0019883hehd",
//             "list0028726783839399"
//           ]
//         },
//         autoSaveToContacts: {
//           active: true,
//           prefix: "pre",
//           suffix: ""
//         }
//       }
//     ]
//   }
// }




// function isValidStruct(struct) {
//   if (!struct.agent) { console.log("first level error") }

//   if (struct.agent.active) {
//     if (!struct.agent.handler) console.log("no handeler error")
//     if (!Array.isArray(struct.agent.handler)) console.log("invalid handler type")
//     if (!struct.agent.handler[0]) console.log("handler is empty")

//     for (let h in struct.agent.handler) {

//       if (!struct.agent.handler[h].prompt || !struct.agent.handler[h].replys || !struct.agent.handler[h].interval || !struct.agent.handler[h].autoSaveToLists || !struct.agent.handler[h].autoSaveToContacts) { console.log("agent first level error") }
//       if (typeof struct.agent.handler[h].prompt !== 'string') console.log("invalid prompt type")
//       if (typeof struct.agent.handler[h].interval !== 'number') console.log("invalid interval type")


//       if (struct.agent.handler[h].autoSaveToContacts.active) {
//         if (struct.agent.handler[h].autoSaveToContacts.prefix) {
//           if (typeof struct.agent.handler[h].autoSaveToContacts.prefix !== 'string') console.log("invalid prefix type")
//         }
//         if (struct.agent.handler[h].autoSaveToContacts.suffix) {
//           if (typeof struct.agent.handler[h].autoSaveToContacts.suffix !== 'string') console.log("invalid suffix type")
//         }
//       }


//       if (struct.agent.handler[h].autoSaveToLists.active) {
//         if (!struct.agent.handler[h].autoSaveToLists.lists) console.log("no list found")
//         if (!Array.isArray(struct.agent.handler[h].autoSaveToLists.lists)) console.log("invalid lists type")
//         if (!struct.agent.handler[h].autoSaveToLists.lists[0]) console.log("no list found")
//         struct.agent.handler[h].autoSaveToLists.lists.forEach(list => {
//           if (typeof list !== 'string') console.log("invalid list type")
//         });
//       }



//       if (!Array.isArray(struct.agent.handler[h].replys)) console.log("invalid reply type")
//       if (!struct.agent.handler[h].replys[0]) console.log("Replys is empty")

//       for (let r in struct.agent.handler[h].replys) {

//         if (struct.agent.handler[h].replys[r].type === "P" || struct.agent.handler[h].replys[r].type === "V" || struct.agent.handler[h].replys[r].type === "A") {
//           if (!struct.agent.handler[h].replys[r].link) console.log("Required content for reply type not found")
//         } else if (struct.agent.handler[h].replys[r].type === "CP" || struct.agent.handler[0].replys[0].type === "CV") {
//           if (!struct.agent.handler[h].replys[r].link) console.log("Required content for reply type not found")
//           if (!struct.agent.handler[h].replys[r].caption) console.log("Required content for reply type not found")
//         } else if (struct.agent.handler[h].replys[r].type === "T") {
//           if (!struct.agent.handler[h].replys[r].text) console.log("Required content for reply type not found")
//         } else {
//           console.log("invalid reply type")
//         }

//       }

//     }

//   }
// }

// isValidStruct(struct)
// console.log("completed")






// const BusinessContact = {
//   businessProfile: {
//     id: {
//       server: 'c.us',
//       user: '2348101083890',
//       _serialized: '2348101083890@c.us'
//     },
//     dataSource: 'server',
//     tag: '3049697775',
//     description: '.',
//     categories: [ [Object] ],
//     profileOptions: { commerceExperience: 'none', cartEnabled: true },
//     email: null,
//     website: [],
//     businessHours: null,
//     address: null,
//     fbPage: {},
//     igProfessional: {},
//     isProfileLinked: false,
//     isProfileLocked: true,
//     coverPhoto: null,
//     automatedType: 'unknown'
//   },
//   id: {
//     server: 'c.us',
//     user: '2348101083890',
//     _serialized: '2348101083890@c.us'
//   },
//   number: '2348101083890',
//   isBusiness: true,
//   isEnterprise: false,
//   labels: undefined,
//   name: 'H James',
//   pushname: 'Jammy',
//   sectionHeader: undefined,
//   shortName: 'H James',
//   statusMute: undefined,
//   type: 'in',
//   verifiedLevel: 0,
//   verifiedName: 'Jammy',
//   isMe: false,
//   isUser: true,
//   isGroup: false,
//   isWAContact: true,
//   isMyContact: true,
//   isBlocked: false
// }




// PrivateContact {
//   id: {
//     server: 'c.us',
//     user: '2349152307875',
//     _serialized: '2349152307875@c.us'
//   },
//   number: '2349152307875',
//   isBusiness: false,
//   isEnterprise: false,
//   labels: undefined,
//   name: 'Csc Ogie',
//   pushname: 'NewGenesis 😎',
//   sectionHeader: undefined,
//   shortName: 'Csc Ogie',
//   statusMute: undefined,
//   type: 'in',
//   verifiedLevel: undefined,
//   verifiedName: undefined,
//   isMe: false,
//   isUser: true,
//   isGroup: false,
//   isWAContact: true,
//   isMyContact: true,
//   isBlocked: false
// }




// {
//     type: "CP",
//     text: "dhjhd jdh",
//     link: "https://myphotolink.file",
// }