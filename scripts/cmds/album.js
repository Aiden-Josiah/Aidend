const axios = require("axios");

module.exports = {
  config: {
    name: "album",
    aliases: ["video", "ভিডিও"],
    version: "1.3",
    author: "SK-SIDDIK-KHAN",
    countDown: 5,
    role: 0,
    description: {
      en: "all video"
    },
    category: "user",
    guide: {
      en: "{pn} [page]"
    }
  },
  onStart: async ({ message, event, commandName, args }) => {
    try {
      const { data: { siddik: videos } } = await axios.get("https://raw.githubusercontent.com/Aiden-Josiah/josiah/refs/heads/main/josiah.json");
      
      const itemsPerPage = 5;
      const page = parseInt(args[0]) || 1;
      const totalPages = Math.ceil(videos.length / itemsPerPage);

      if (page < 1 || page > totalPages) {
        return message.reply({ body: `Invalid page number. Please enter a number between 1 and ${totalPages}.` });
      }

      const startIndex = (page - 1) * itemsPerPage;
      const videosOnPage = videos.slice(startIndex, startIndex + itemsPerPage);

      let messageContent = `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\nআপনার পছন্দের ভিডিও দেখতে একটি নাম্বারে রিপ্লাই করুন:\n\n╰╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╯\n`;

      videosOnPage.forEach(video => {
        messageContent += `\n╭────────────────⊙\n├─☾ ${video.number}. ${video.name}\n╰────────────────⊙`;
      });

      messageContent += `\n☽━━━━━━━━━━━━━━━━━━☾\n           🔰 | 𝐏𝐚𝐠𝐞 [ ${page}/${totalPages} ] 🔰\n☽━━━━━━━━━━━━━━━━━━☾`;

      message.reply({ body: messageContent }, (err, replyMessage) => {
        if (!err) {
          global.GoatBot.onReply.set(replyMessage.messageID, {
            commandName,
            messageID: replyMessage.messageID,
            author: event.senderID,
            siddik: videos,
            currentPage: page,
            itemsPerPage,
            totalPages,
            type: "reply"
          });
        }
      });
    } catch (error) {
      message.reply({ body: "Failed to fetch video list. Please try again later." });
    }
  },
  onReply: async ({ message, event, Reply, args, api }) => { 
    if (event.senderID !== Reply.author) return;

    const selectedNumber = parseInt(args[0]);
    if (isNaN(selectedNumber)) {
      return message.reply({ body: "Please enter a valid number." });
    }

    const selectedVideo = Reply.siddik.find(video => video.number === selectedNumber);

    if (selectedVideo) {
      const loadingMessage = await message.reply({ body: "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭...⏰" });

      try {
        const videoUrl = selectedVideo.verses[Math.floor(Math.random() * selectedVideo.verses.length)];
        
        await message.reply({
          body: `𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-${selectedVideo.name}`,
          attachment: await global.utils.getStreamFromURL(videoUrl)
        });
        
        await api.unsendMessage(loadingMessage.messageID); 
      } catch (error) {
        message.reply({ body: "Failed to send the video. Please try again." });
        await api.unsendMessage(loadingMessage.messageID);
      }
    } else {
      message.reply({ body: "Invalid selection. Please try again." });
    }
  }
};
