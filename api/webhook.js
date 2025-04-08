// api/webhook.js

// 可使用 ES Modules 語法 export default，也可使用 CommonJS module.exports 兩種方式皆可
export default function handler(req, res) {
  // 只允許 POST 方法（LINE Webhook 會用 POST 送出事件）
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST" });
  }

  // 為了方便除錯，可以先 log 請求內容
  console.log("Received webhook:", req.body);

  // 若需要解析 JSON 請確認 Vercel 自動解析
  // Vercel 會根據 HTTP Header Content-Type 自動轉換 req.body 為物件（若請求送上 JSON）
  // 如果尚未解析，可用 JSON.parse(req.body) 但通常不必

  // 在此處可增加驗證機制，例如比對 LINE Signature (依需求加入)
  // 例如：檢查 HTTP Header 中的 "x-line-signature"（若有需要）

  // 處理事件 (例如：根據事件類型來回覆、記錄資料、轉發訊息等)
  // 在此範例我們只回應一個簡單的訊息
  // 若要做後續邏輯可以根據 req.body.events 陣列進行處理

  // 回應 200 OK 表示已正確接收事件
  return res.status(200).json({ status: "success", message: "Webhook received" });
}
