import React from "react";
import s from "./Header.module.css";

export default function Header({ title, balance }) {
  return (
    <header className={s.header}>
      <div className={s.logo}>{title ?? balance ?? "Zaman Bank"}</div>
      <div className={s.profile} onClick={() => alert("Профиль пользователя")}>
        <i className="fas fa-user" />
      </div>
    </header>
  );
}
