const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { ezra } = require("../fredi/ezra");
const traduire = require("../fredi/traduction");
const { downloadMediaMessage,downloadContentFromMessage } =  require('@whiskeysockets/baileys');
const fs =require("fs-extra") ;
const axios = require('axios');  
const FormData = require('form-data');
const { exec } = require("child_process");



async function uploadToTelegraph(Path) {
  if (!fs.existsSync(Path)) {
      throw new Error("Fichier non existant");
  }

  try {
      const form = new FormData();
      form.append("file", fs.createReadStream(Path));

      const { data } = await axios.post("https://telegra.ph/upload", form, {
          headers: {
              ...form.getHeaders(),
          },
      });

      if (data && data[0] && data[0].src) {
          return "https://telegra.ph" + data[0].src;
      } else {
          throw new Error("Erreur lors de la récupération du lien de la vidéo");
      }
  } catch (err) {
      throw new Error(String(err));
  }
}



ezra({nomCom:"s-s-s",categorie: "Conversion", reaction: "❤️"},async(origineMessage,zk,commandeOptions)=>{

let {ms,mtype,arg,repondre,nomAuteurMessage}=commandeOptions
  var txt=JSON.stringify(ms.message)

  var mime=mtype === "imageMessage" || mtype === "videoMessage";
  var tagImage = mtype==="extendedTextMessage" && txt.includes("imageMessage")
  var tagVideo = mtype==="extendedTextMessage" && txt.includes("videoMessage")

const alea = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;};


  const stickerFileName = alea(".webp");


            // image
  if (mtype === "imageMessage" ||tagImage) {
    let downloadFilePath;
    if (ms.message.imageMessage) {
      downloadFilePath = ms.message.imageMessage;
    } else {
      // picture mentioned
      downloadFilePath =
        ms.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    }
    // picture
    const media = await downloadContentFromMessage(downloadFilePath, "image");
    let buffer = Buffer.from([]);
    for await (const elm of media) {
      buffer = Buffer.concat([buffer, elm]);
    }

    sticker = new Sticker(buffer, {
      pack:"DAVINCS-MD" ,
      author: nomAuteurMessage,
      type:
        arg.includes("crop") || arg.includes("c")
          ? StickerTypes.CROPPED
          : StickerTypes.FULL,
      quality: 100,
    });
  } else if (mtype === "videoMessage" || tagVideo) {
    // videos
    let downloadFilePath;
    if (ms.message.videoMessage) {
      downloadFilePath = ms.message.videoMessage;
    } else {
      downloadFilePath =
        ms.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    }
    const stream = await downloadContentFromMessage(downloadFilePath, "video");
    let buffer = Buffer.from([]);
    for await (const elm of stream) {
      buffer = Buffer.concat([buffer, elm]);
    }

    sticker = new Sticker(buffer, {
      pack:"JEEPERS CREEPER-XMD", // pack stick
      author:  nomAuteurMessage, // name of the author of the stick
      type:
        arg.includes("-r") || arg.includes("-c")
          ? StickerTypes.CROPPED
          : StickerTypes.FULL,
      quality: 40,
    });
  } else {
    repondre("Please mention an image or video!");
    return;
  }

  await sticker.toFile(stickerFileName);
  await zk.sendMessage(
    origineMessage,
    {
      sticker: fs.readFileSync(stickerFileName),
    },
    { quoted: ms }
  );

try{
  fs.unlinkSync(stickerFileName)
}catch(e){console.log(e)}





  
});

ezra({nomCom:"cropp",categorie: "Conversion", reaction: "♻️"},async(origineMessage,zk,commandeOptions)=>{
   const {ms , msgRepondu,arg,repondre,nomAuteurMessage} = commandeOptions ;

  if(!msgRepondu) { repondre( 'make sure to mention the media' ) ; return } ;
  if(!(arg[0])) {
       pack = nomAuteurMessage
  } else {
    pack = arg.join(' ')
  } ;
  if (msgRepondu.imageMessage) {
     mediamsg = msgRepondu.imageMessage
  } else if(msgRepondu.videoMessage) {
mediamsg = msgRepondu.videoMessage
  } 
  else if (msgRepondu.stickerMessage) {
    mediamsg = msgRepondu.stickerMessage ;
  } else {
    repondre('Uh media please'); return
  } ;

  var stick = await zk.downloadAndSaveMediaMessage(mediamsg)

     let stickerMess = new Sticker(stick, {
            pack: pack,
            
            type: StickerTypes.CROPPED,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer2 = await stickerMess.toBuffer();
          zk.sendMessage(origineMessage, { sticker: stickerBuffer2 }, { quoted: ms });

});

ezra({nomCom:"get-stic",categorie: "Conversion", reaction: "😜"},async(origineMessage,zk,commandeOptions)=>{
   const {ms , msgRepondu,arg,repondre,nomAuteurMessage} = commandeOptions ;

  if(!msgRepondu) { repondre( 'make sure to mention the media' ) ; return } ;
  if(!(arg[0])) {
       pack = nomAuteurMessage
  } else {
    pack = arg.join(' ')
  } ;
  if (msgRepondu.imageMessage) {
     mediamsg = msgRepondu.imageMessage
  } else if(msgRepondu.videoMessage) {
mediamsg = msgRepondu.videoMessage
  } 
  else if (msgRepondu.stickerMessage) {
    mediamsg = msgRepondu.stickerMessage ;
  } else {
    repondre('Uh a media please'); return
  } ;

  var stick = await zk.downloadAndSaveMediaMessage(mediamsg)

     let stickerMess = new Sticker(stick, {
            pack: pack,
            
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer2 = await stickerMess.toBuffer();
          zk.sendMessage(origineMessage, { sticker: stickerBuffer2 }, { quoted: ms });

});



ezra({ nomCom: "fwords", categorie: "Conversion", reaction: "😂" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  if (!msgRepondu) {
    repondre('Please mention an image');
    return;
  }

  if (!msgRepondu.imageMessage) {
    repondre('The command only works with images');
    return;
  } ;
  text = arg.join(' ') ;
  
  if(!text || text === null) {repondre('Make sure to insert text') ; return } ;
 
  
  const mediamsg = msgRepondu.imageMessage;
  const image = await zk.downloadAndSaveMediaMessage(mediamsg);

  //Create a FormData object
  const data = new FormData();
  data.append('image', fs.createReadStream(image));

  //Configure headers
  const clientId = 'b40a1820d63cd4e'; // Replace with your Imgur client ID
  const headers = {
    'Authorization': `Client-ID ${clientId}`,
    ...data.getHeaders()
  };

  // Configure the query
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://files.catbox.moe/#',
    headers: headers,
    data: data
  };

  try {
    const response = await axios(config);
    const imageUrl = response.data.data.link;
    console.log(imageUrl)

    //Use imageUrl however you want (meme creation, etc.)
    const meme = `https://api.memegen.link/images/custom/-/${text}.png?background=${imageUrl}`;

    // Create the sticker
    const stickerMess = new Sticker(meme, {
      pack: nomAuteurMessage,
      author: 'JEEPERS CREEPER-XMD',
      type: StickerTypes.FULL,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 70,
      background: "transparent",
    });

    const stickerBuffer2 = await stickerMess.toBuffer();
    zk.sendMessage(
      origineMessage,
      { sticker: stickerBuffer2 },
      { quoted: ms }
    );

  } catch (error) {
    console.error('Error uploading to Imgur :', error);
    repondre('An error occurred while creating the meme.');
  }
});



ezra({nomCom:"pictures",categorie: "Conversion", reaction: "💀"},async(dest,zk,commandeOptions)=>{
   const {ms , msgRepondu,arg,repondre,nomAuteurMessage} = commandeOptions ;

  if(!msgRepondu) { repondre( 'make sure to mention the media' ) ; return } ;
 
   if (!msgRepondu.stickerMessage) {
      repondre('Um mention a non-animated sticker'); return
  } ;

 let mediaMess = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);

  const alea = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;};
  
  let ran = await alea(".png");

  
        exec(`ffmpeg -i ${mediaMess} ${ran}`, (err) => {
          fs.unlinkSync(mediaMess);
          if (err) {
            zk.sendMessage(
              dest,
              {
                text: 'A non-animated sticker please',
              },
              { quoted: ms }
            );
            return;
          }
          let buffer = fs.readFileSync(ran);
          zk.sendMessage(
            dest,
            { image: buffer },
            { quoted: ms }
          );
          fs.unlinkSync(ran);
        });
});

ezra({ nomCom: "translate", categorie: "Conversion", reaction: "⌛" }, async (dest, zk, commandeOptions) => {

  const { msgRepondu, repondre , arg } = commandeOptions;

  
   if(msgRepondu) {
     try {
      
     

       if(!arg || !arg[0]) { repondre('(eg : translate en)') ; return }
   

         let texttraduit = await traduire(msgRepondu.conversation , {to : arg[0]}) ;

         repondre(texttraduit)

        } catch (error) {
          
          repondre('Mention a texte Message') ;
      
        }

   } else {
     
     repondre('Mention a texte Message')
   }



}) ; 
