import React from "react";
import s from "./StatsSection.module.css";

export default function StatsSection(){
  return (
    <section className={s.wrap}>
      <div className={s.head}>
        <span>Статистика</span>
        <span className={s.more}>Подробнее <i className="fas fa-chevron-right" /></span>
      </div>
      <div className={s.grid}>
        <div className={s.item}>
          <div className={`${s.value} ${s.positive}`}>+2,000 ₸</div>
          <div className={s.label}>Вчера</div>
        </div>
        <div className={s.item}>
          <div className={`${s.value} ${s.negative}`}>-1,000 ₸</div>
          <div className={s.label}>Сегодня</div>
        </div>
        <div className={s.item}>
          <div className={s.value}>12,450 ₸</div>
          <div className={s.label}>В этом месяце</div>
        </div>
        <div className={s.item}>
          <div className={s.value}>156,800 ₸</div>
          <div className={s.label}>В этом году</div>
        </div>
      </div>
    </section>
  );
}
