import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sim, gia, nhaMang, loaiSim, name, phone, zalo } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: "Missing Telegram config" }, { status: 500 });
    }

    const text = `
📱 Yêu cầu giữ số mới:
• Sim: ${sim}
• Giá: ${Number(gia).toLocaleString()} đ
• Nhà mạng: ${nhaMang}
• Loại sim: ${loaiSim}
👤 Khách: ${name}
📞 Điện thoại: ${phone}
💬 Zalo: ${zalo || "(không có)"}
    `;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!tgRes.ok) {
      const error = await tgRes.text();
      console.error("Telegram error:", error);
      return NextResponse.json({ error: "Telegram API failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
