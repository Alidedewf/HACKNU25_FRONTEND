import React from "react";
import { getUser } from "../../lib/auth";

import s from "./BalanceCard.module.css";


export default function BalanceCard({ balance, onClick }) {
    const user = getUser();
  const name = user?.name
  ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()
  : "User name";
  return (
    <div className={s.card} onClick={onClick}>
      <div className={s.title}>Общий баланс</div>
      <div className={s.amount}>{balance}</div>
      <div className={s.chip} />
      <div className={s.number}>4589 •••• •••• ••••</div>
      <div className={s.details}>
        <span>Здравствуйте, {name}</span>
        <span>09/25</span>
      </div>
    </div>
  );
}
