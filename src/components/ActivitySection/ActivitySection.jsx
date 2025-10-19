import React from "react";
import s from "./ActivitySection.module.css";

const rows = [
  { icon:"fa-shopping-cart", name:"Супермаркет", date:"Сегодня, 14:30", amount:"-8,450 ₸", type:"neg" },
  { icon:"fa-utensils",     name:"Ресторан",   date:"Сегодня, 12:15", amount:"-12,800 ₸", type:"neg" },
  { icon:"fa-money-bill-wave", name:"Зарплата", date:"Вчера",          amount:"+250,000 ₸", type:"pos" },
  { icon:"fa-gas-pump",     name:"Заправка",   date:"2 дня назад",     amount:"-15,200 ₸", type:"neg" },
];

export default function ActivitySection(){
  return (
    <section className={s.wrap}>
      <div className={s.head}>
        <span>Активность</span>
        <span className={s.more}>Вся активность <i className="fas fa-chevron-right" /></span>
      </div>

      <div className={s.list}>
        {rows.map((r, idx)=>(
          <div className={s.row} key={idx}>
            <div className={s.info}>
              <div className={s.icon}><i className={`fas ${r.icon}`} /></div>
              <div>
                <div className={s.name}>{r.name}</div>
                <div className={s.date}>{r.date}</div>
              </div>
            </div>
            <div className={`${s.amount} ${r.type==="pos" ? s.pos : s.neg}`}>{r.amount}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
