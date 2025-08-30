import Image from "next/image";

export default function DangKySimPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">📌 Hướng dẫn đăng ký sim qua My Viettel</h1>
      <p className="mb-4">
        Đây là các bước đơn giản để bạn có thể đăng ký sim một cách nhanh chóng.
      </p>

      {/* Hiển thị ảnh từ thư mục public */}
      <Image
        src="/images/huong-dan-dang-ky.jpg"
        alt="Hướng dẫn đăng ký sim"
        width={800}
        height={600}
        className="rounded-lg shadow-md"
      />

      <p className="mt-4">
        Nếu cần hỗ trợ thêm, vui lòng liên hệ 📞 098.6666.178.
      </p>
    </div>
  );
}
