export const initTelegram = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // Разворачивает веб-приложение
      return tg;
    }
    console.error("Telegram WebApp SDK not found");
    return null;
  };