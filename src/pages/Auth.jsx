import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./Auth.module.css";
import { setUser, getUser } from "../lib/auth";


export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // если пользователь уже входил ранее
  useEffect(() => {
    const user = localStorage.getItem("zamanUser");
    if (user) navigate("/");
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || (mode === "register" && !name)) {
      setError("Заполните все поля");
      return;
    }

    if (mode === "register") {
        setUser({ name: name.trim(), email: email.trim() });
    } else {
        const stored = getUser();
        if (!stored || stored.email !== email.trim()) {
          setError("Пользователь не найден");
          return;
        }
      }

      navigate(from, { replace: true }); 
    };

  const logoutDemo = () => {
    localStorage.removeItem("zamanUser");
    window.location.reload();
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.logo}>Zaman Bank</h1>
        <p className={s.subtitle}>
          {mode === "login" ? "Добро пожаловать!" : "Создай аккаунт, чтобы начать"}
        </p>

        <form onSubmit={handleSubmit} className={s.form}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className={s.error}>{error}</div>}
          <button type="submit" className={s.btn}>
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className={s.switch}>
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <span onClick={() => setMode("register")}>Регистрация</span>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <span onClick={() => setMode("login")}>Войти</span>
            </>
          )}
        </div>

        <div className={s.demo} onClick={logoutDemo}>
          Очистить данные (демо)
        </div>
      </div>
    </div>
  );
}
