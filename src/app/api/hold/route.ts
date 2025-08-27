import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { simId, name, phone, zalo } = body;

    console.log("Khách giữ số:", { simId, name, phone, zalo });

    // Gửi tin nhắn về Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      throw new Error("Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong .env.local");
    }

    const text = `📢 KHÁCH GIỮ SỐ\n\n📱 Sim: ${simId}\n👤 Tên: ${name}\n📞 Điện thoại: ${phone}\n💬 Zalo: ${zalo || "-"}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    return NextResponse.json({ success: true, message: "Đã giữ số thành công" });
  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
