// api/webhook.js

export default async function handler(req, res) {
  // 僅允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }
  
  try {
    // 解析 LINE Webhook 傳入的 JSON 請求 (Vercel 自動解析)
    const jsonData = req.body;
    
    // 取得 events 陣列
    const events = jsonData.events;
    if (!events || events.length === 0) {
      return res.status(200).json({ message: 'No events' });
    }
    
    // 處理每一個事件
    for (const event of events) {
      // 根據 source.type 決定該用哪個 id
      let sourceId = "";
      const source = event.source;
      
      if (source && source.type) {
        if (source.type === "group" && source.groupId) {
          sourceId = source.groupId;  // 群組對話的 ID
        } else if (source.type === "room" && source.roomId) {
          sourceId = source.roomId;   // 多人聊天室對話的 ID
        } else if (source.userId) {
          sourceId = source.userId;   // 個人對話的 ID
        }
      }
      
      const replyToken = event.replyToken;
      const message = (event.message && event.message.text) || '';
      
      console.log(`SourceID: ${sourceId}, Message: ${message}`);
      
      // 回覆用戶訊息 (這裡仍以 Reply 方式回覆)
      await replyToLine(replyToken, `您說了: ${message}\n(識別碼：${sourceId})`);
    }
    
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ status: 'error', message: error.toString() });
  }
}

// 回覆訊息給 LINE 的函式 (使用 Messaging API Reply 端點)
async function replyToLine(replyToken, text) {
  const CHANNEL_ACCESS_TOKEN = 'YOUR_LINE_CHANNEL_ACCESS_TOKEN';
  
  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: text
    }]
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    body: JSON.stringify(payload)
  };
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log('LINE reply response:', data);
}
