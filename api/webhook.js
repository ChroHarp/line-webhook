// api/webhook.js

// 若您希望使用 ES Modules 方式，Vercel 支持 export default
export default async function handler(req, res) {
  // 僅允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }
  
  try {
    // Vercel 會自動解析 JSON，如果 header 裡 Content-Type 設定為 application/json
    const jsonData = req.body;
    
    // 取得 events 陣列 (LINE Webhook 的 payload 結構)
    const events = jsonData.events;
    if (!events || events.length === 0) {
      return res.status(200).json({ message: 'No events' });
    }
    
    // 處理每一個事件
    for (const event of events) {
      const replyToken = event.replyToken;
      const userId = (event.source && event.source.userId) || null;
      const message = (event.message && event.message.text) || '';
      
      console.log(`UserID: ${userId}, Message: ${message}`);
      
      // 呼叫回覆函式
      await replyToLine(replyToken, `您說了: ${message}`);
    }
    
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ status: 'error', message: error.toString() });
  }
}

// 回覆訊息給 LINE 使用 Messaging API 的 Reply 端點
async function replyToLine(replyToken, text) {
  // 請替換為您在 LINE Developers 後台取得的 Channel Access Token
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
