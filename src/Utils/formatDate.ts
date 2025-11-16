export const formatDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    // year: "numeric",
  });
};

// 🔧 Hàm tính khoảng thời gian tương đối
export const timeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
};
export const getPlatformFromName = (name: string): string => {
  if(!name) return "Unknown";
  const lower = name.toLowerCase();
  if (lower.includes("facebook")) return "Facebook";
  if (lower.includes("telegram")) return "Telegram";
  if (lower.includes("instagram")) return "Instagram";
  if (lower.includes("whatsapp")) return "WhatsApp";
  if (lower.includes("twitter")) return "Twitter";
  return "Unknown";
};
