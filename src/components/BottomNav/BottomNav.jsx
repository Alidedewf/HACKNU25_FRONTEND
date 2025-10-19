import React from "react";
import { Link } from "react-router-dom";
import s from "./BottomNav.module.css";

export default function BottomNav({ active }) {
  return (
    <nav className={s.nav}>
      <Link className={`${s.item} ${active==="home" ? s.active : ""}`} to="/">
        <i className={`fas fa-home ${s.icon}`} />
        <div>Главная</div>
      </Link>
      <Link className={s.item} to="/analysis">
        <i className={`fas fa-chart-pie ${s.icon}`} />
        <div>Анализ</div>
      </Link>
      <div className={s.item}>
        <i className={`fas fa-credit-card ${s.icon}`} />
        <div>Карта</div>
      </div>
      <Link className={`${s.item} ${active==="chat" ? s.active : ""}`} to="/chat">
        <i className={`fas fa-comments ${s.icon}`} />
        <div>Поддержка</div>
      </Link>
    </nav>
  );
}
