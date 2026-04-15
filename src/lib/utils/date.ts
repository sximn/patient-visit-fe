export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("sk-SK");

export const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
