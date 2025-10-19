import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";
import s from "./Chat.module.css";

const systemPrompt = `
Ты — человекоподобный ассистент Zaman Bank. 
Помогай ставить финансовые цели, анализировать расходы и доходы, 
подбирать продукты банка, мотивировать клиента и предлагать здоровые способы борьбы со стрессом. 
Отвечай кратко, по делу, дружелюбно и с эмпатией.`;

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привет! Я ваш ассистент Zaman Bank. Чем могу помочь сегодня?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Автопрокрутка вниз
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, loading]);

  // ====== Голосовой ввод ======
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(ask, 500);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ====== Озвучка ======
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  // Озвучиваем ответы ассистента
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") {
      speak(last.content);
    }
  }, [messages]);

  // ====== Функция отправки запроса на сервер ======
  const ask = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      // Отправляем запрос на твой backend
      const res = await fetch("https://gogogo-pz1p.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${systemPrompt}\n\nПользователь: ${text}`,
        }),
      });

      if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
      const data = await res.json();

      const reply = data.response || "Извините, сервер не вернул ответ.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Ошибка при обращении к API:", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Произошла ошибка при обращении к серверу 😔" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quick = (q) => {
    setInput(q);
    setTimeout(ask, 0);
  };

  return (
    <div className="page">
      <Header title="Поддержка" />

      <div className={s.header}>
        <div className={s.botAvatar}><i className="fas fa-robot" /></div>
        <div className={s.title}>Квантум-помощник</div>
        <div className={s.subtitle}>Задайте вопрос — я рядом</div>
      </div>

      <div ref={boxRef} className={s.chatBox}>
        {/* приветствие + быстрые кнопки */}
        {messages.length === 1 && (
          <div className={`${s.msg} ${s.bot}`}>
            Привет! Я могу рассказать про цели, анализ расходов, кэшбэк и продукты банка.
            <div className={s.time}>сейчас</div>
            <div className={s.quick}>
              <button onClick={() => quick("Хочу накопить на квартиру за 3 года, доход 450k, траты 300k")}>
                Фин. цель
              </button>
              <button onClick={() => quick("Сделай анализ расходов и дай советы как сократить траты")}>
                Аналитика
              </button>
              <button onClick={() => quick("Что по кэшбэку и выгодным продуктам банка?")}>
                Продукты
              </button>
              <button onClick={() => quick("Я стрессую и трачу лишнее — помоги")}>
                Анти-стресс
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`${s.msg} ${m.role === "user" ? s.user : s.bot}`}>
            {m.content}
          </div>
        ))}

        {loading && (
          <div className={s.typing}>
            <div className={s.dot}></div>
            <div className={s.dot}></div>
            <div className={s.dot}></div>
          </div>
        )}
      </div>

      <div className={s.inputBar}>
        <button onClick={startListening} className={s.micBtn}>
          <i className={`fas fa-microphone ${listening ? s.micActive : ""}`} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Введите сообщение…"
        />
        <button onClick={ask}><i className="fas fa-paper-plane" /></button>
      </div>

      <BottomNav active="chat" />
    </div>
  );
}
