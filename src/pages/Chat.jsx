import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";
import s from "./Chat.module.css";


const systemPrompt =
`Ты — человекоподобный ассистент Zaman Bank. Помогай ставить финансовые цели, 
давай персональные советы по тратам/доходам, подбирай продукты банка, 
поддерживай клиента и предлагай здоровые способы борьбы со стрессом. Отвечай кратко и по делу.`;

export default function Chat(){
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Привет! Я ваш ассистент Zaman Bank. Чем могу помочь сегодня?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);  

  useEffect(()=>{
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, loading]);

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
      setTimeout(ask, 500); // отправляем как обычное сообщение
    };
  
    recognition.start();
    recognitionRef.current = recognition;
  };
  
  // 2️⃣ Функция озвучивания ответов
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };
  
  // 3️⃣ Озвучиваем каждый ответ ассистента
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") {
      speak(last.content);
    }
  }, [messages]);

  const ask = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
  
    // Имитируем “умный” ответ
    setTimeout(() => {
      let reply = "Извините, я пока не подключён к серверу Zaman Bank.";
      const t = text.toLowerCase();
  
      if (t.includes("цель") || t.includes("накопить"))
        reply = "Вы можете создать финансовую цель — например, накопить на квартиру за 3 года. Я помогу рассчитать план!";
      else if (t.includes("кэшбэк") || t.includes("cashback"))
        reply = "Кэшбэк до 5% по категориям: АЗС, рестораны, покупки. Всё честно!";
      else if (t.includes("расход") || t.includes("доход"))
        reply = "Ваши расходы в норме, но можно оптимизировать траты на кафе и такси 😉";
      else if (t.includes("стресс"))
        reply = "Расслабьтесь! Попробуйте прогулку, дыхание или чтение книги вместо спонтанных покупок 💆‍♀️";
  
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 1000);
  };
  

  const quick = (q) => { setInput(q); setTimeout(ask, 0); };

  return (
    <div className="page">
      <Header title="Поддержка" />
      <div className={s.header}>
        <div className={s.botAvatar}><i className="fas fa-robot" /></div>
        <div className={s.title}>Квантум-помощник</div>
        <div className={s.subtitle}>Задайте вопрос — я рядом</div>
      </div>

      <div ref={boxRef} className={s.chatBox}>
        {/* приветствие + быстрые кнопки один раз */}
        {messages.length === 1 && (
          <div className={`${s.msg} ${s.bot}`}>
            Привет! Я могу рассказать про цели, анализ расходов, кэшбэк и продукты банка.
            <div className={s.time}>сейчас</div>
            <div className={s.quick}>
              <button onClick={()=>quick("Хочу накопить на квартиру за 3 года, доход 450k, траты 300k")}>Фин. цель</button>
              <button onClick={()=>quick("Сделай анализ расходов и дай советы как сократить траты")}>Аналитика</button>
              <button onClick={()=>quick("Что по кэшбэку и выгодным продуктам банка?")}>Продукты</button>
              <button onClick={()=>quick("Я стрессую и трачу лишнее — помоги")}>Анти-стресс</button>
            </div>
          </div>
        )}

        {messages.map((m, i)=>(
          <div key={i} className={`${s.msg} ${m.role==="user" ? s.user : s.bot}`}>
            {m.content}
          </div>
        ))}

        {loading && (
          <div className={s.typing}>
            <div className={s.dot}></div><div className={s.dot}></div><div className={s.dot}></div>
          </div>
        )}
      </div>

      <div className={s.inputBar}>
      <button onClick={startListening} className={s.micBtn}>
    <i className={`fas fa-microphone ${listening ? s.micActive : ""}`} />
  </button>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && ask()}
          placeholder="Введите сообщение…"
        />
        
        <button onClick={ask}><i className="fas fa-paper-plane" /></button>
      </div>

      <BottomNav active="chat" />
    </div>
  );
}
