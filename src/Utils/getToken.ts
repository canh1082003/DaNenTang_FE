// 📦 src/utils/auth.ts

export const getToken = (): string | null => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return null;

    const parsed = JSON.parse(userInfo);
    return parsed?.token || null;
  } catch (error) {
    console.error("❌ Error parsing userInfo from localStorage:", error);
    return null;
  }
};
