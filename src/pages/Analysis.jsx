import React, { useMemo, useState } from "react";
import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";
import s from "./Analysis.module.css";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";

// Мок-транзакции (для демо; позже можно заменить реальными данными)
const transactions = [
  // amount < 0 — расход, >0 — доход
  { id: 1, date: "2025-10-10", category: "Продукты",     merchant: "Supermarket",   amount: -8450 },
  { id: 2, date: "2025-10-10", category: "Кафе и еда",   merchant: "Cafe Rio",      amount: -12800 },
  { id: 3, date: "2025-10-09", category: "Доход",        merchant: "Работа",        amount: +250000 },
  { id: 4, date: "2025-10-08", category: "Транспорт",    merchant: "Заправка",      amount: -15200 },
  { id: 5, date: "2025-10-07", category: "Подписки",     merchant: "Netflix",       amount: -2990 },
  { id: 6, date: "2025-10-07", category: "Связь",        merchant: "Mobile KZ",     amount: -3500 },
  { id: 7, date: "2025-10-06", category: "Здоровье",     merchant: "Аптека",        amount: -4200 },
  { id: 8, date: "2025-10-06", category: "Продукты",     merchant: "GreenMart",     amount: -6200 },
  { id: 9, date: "2025-10-05", category: "Кафе и еда",   merchant: "CoffeeBar",     amount: -2100 },
  { id:10, date: "2025-10-05", category: "Развлечения",  merchant: "Cinema",        amount: -4500 },
  { id:11, date: "2025-10-04", category: "Одежда",       merchant: "FashionX",      amount: -18500 },
  { id:12, date: "2025-10-03", category: "Продукты",     merchant: "Supermarket",   amount: -7200 },
  { id:13, date: "2025-10-02", category: "Транспорт",    merchant: "Такси",         amount: -2300 },
  { id:14, date: "2025-10-01", category: "Доход",        merchant: "Фриланс",       amount: +120000 },
];

// Цвета для сегментов (под стиль)
const COLORS = ["#EEFE6D", "#2D9A86", "#7AD7C3", "#4CB9A8", "#B1F3D2", "#A3FFD6", "#8CE6C8", "#5AC1B1"];

function groupByCategory(expenses) {
  const map = new Map();
  expenses.forEach(t => {
    const key = t.category || "Другое";
    map.set(key, (map.get(key) || 0) + Math.abs(t.amount));
  });
  return Array.from(map, ([name, value]) => ({ name, value }));
}

function groupByDate(expenses) {
  const map = new Map();
  expenses.forEach(t => {
    const key = t.date;
    map.set(key, (map.get(key) || 0) + Math.abs(t.amount));
  });
  return Array.from(map, ([date, total]) => ({ date, total })).sort((a,b)=> a.date.localeCompare(b.date));
}

function topMerchants(expenses, limit = 5) {
  const map = new Map();
  expenses.forEach(t => {
    const key = t.merchant || "Магазин";
    map.set(key, (map.get(key) || 0) + Math.abs(t.amount));
  });
  return Array.from(map, ([merchant, total]) => ({ merchant, total }))
    .sort((a,b)=> b.total - a.total)
    .slice(0, limit);
}

export default function Analysis() {
  const [period, setPeriod] = useState("month"); // "week" | "month"

  // Фильтр по периоду (демо: просто берём все; можно легко сузить по дате)
  const dataFiltered = useMemo(() => {
    // здесь можешь отфильтровать по датам в зависимости от period
    return transactions;
  }, [period]);

  const expenses = useMemo(() => dataFiltered.filter(t => t.amount < 0), [dataFiltered]);
  const income   = useMemo(() => dataFiltered.filter(t => t.amount > 0), [dataFiltered]);

  const totalExpense = useMemo(() => expenses.reduce((s,t)=> s + Math.abs(t.amount), 0), [expenses]);
  const totalIncome  = useMemo(() => income.reduce((s,t)=> s + t.amount, 0), [income]);

  const byCategory = useMemo(() => groupByCategory(expenses), [expenses]);
  const byDate     = useMemo(() => groupByDate(expenses), [expenses]);
  const merchants  = useMemo(() => topMerchants(expenses, 5), [expenses]);

  // Наиболее “тяжёлая” категория
  const topCategory = byCategory.slice().sort((a,b)=> b.value - a.value)[0]?.name || "Продукты";

  // Простой инсайт
  const insight = `За выбранный период расходы составили ${totalExpense.toLocaleString()} ₸, 
основная категория — «${topCategory}». Попробуйте снизить траты в этой категории на 10–15% 
(замена брендов, планирование покупок, скидки). А доходы — ${totalIncome.toLocaleString()} ₸.`;

  return (
    <div className="page">
      <Header title="Анализ" />

      {/* Переключатель периода */}
      <div className={s.toolbar}>
        <div className={s.pills}>
          <button className={`${s.pill} ${period==="week" ? s.active : ""}`} onClick={()=>setPeriod("week")}>Неделя</button>
          <button className={`${s.pill} ${period==="month" ? s.active : ""}`} onClick={()=>setPeriod("month")}>Месяц</button>
        </div>
        <div className={s.kpis}>
          <div className={s.kpi}>
            <div className={s.kpiLabel}>Расходы</div>
            <div className={`${s.kpiValue} ${s.neg}`}>-{totalExpense.toLocaleString()} ₸</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiLabel}>Доходы</div>
            <div className={`${s.kpiValue} ${s.pos}`}>+{totalIncome.toLocaleString()} ₸</div>
          </div>
        </div>
      </div>

      {/* Круговая диаграмма: доли по категориям */}
      <section className={s.card}>
        <div className={s.cardHead}>
          <div className={s.cardTitle}><i className="fas fa-chart-pie" /> Расходы по категориям</div>
        </div>
        <div className={s.grid2}>
          <div className={s.chartBox}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  cornerRadius={6}
                  paddingAngle={3}
                  stroke="#0A0A14"
                  strokeWidth={2}
                >
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                formatter={(value, name) => [`${value.toLocaleString()} ₸`, name]}
                contentStyle={{
                    background: "#1E1E2D",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "13px",
                }}
                />                
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Легенда/детализация */}
          <div className={s.legend}>
            {byCategory.map((c, i)=>(
              <div key={c.name} className={s.legendRow}>
                <span className={s.legendDot} style={{ background: COLORS[i % COLORS.length] }} />
                <span className={s.legendName}>{c.name}</span>
                <span className={s.legendValue}>{c.value.toLocaleString()} ₸</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Бар-чарт: топ магазины */}
      <section className={s.card}>
        <div className={s.cardHead}>
          <div className={s.cardTitle}><i className="fas fa-store" /> Топ мест трат</div>
        </div>
        <div className={s.chartBoxWide}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={merchants} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="merchant" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip contentStyle={{ background: "#1E1E2D", border: "1px solid rgba(255,255,255,0.1)", color:"#fff" }} />
              <Bar dataKey="total" fill="#2D9A86" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Линия: расходы по дням */}
      <section className={s.card}>
        <div className={s.cardHead}>
          <div className={s.cardTitle}><i className="fas fa-chart-line" /> Динамика расходов</div>
        </div>
        <div className={s.chartBoxWide}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={byDate} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip contentStyle={{ background: "#1E1E2D", border: "1px solid rgba(255,255,255,0.1)", color:"#fff" }} />
              <Line type="monotone" dataKey="total" stroke="#EEFE6D" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Инсайт ассистента — смысл для проекта */}
      <section className={s.card}>
        <div className={s.cardHead}>
          <div className={s.cardTitle}><i className="fas fa-lightbulb" /> Персональная подсказка</div>
        </div>
        <div className={s.insight}>{insight}</div>
        <div className={s.tipList}>
          <div className={s.tip}><i className="fas fa-check-circle" /> Включите «Список покупок» и планируйте визиты в магазин.</div>
          <div className={s.tip}><i className="fas fa-check-circle" /> Сравните цены и переходите на аналоги в дорогих категориях.</div>
          <div className={s.tip}><i className="fas fa-check-circle" /> Настройте цель «Подушка безопасности» — 3–6 месячных расходов.</div>
        </div>
      </section>

      <BottomNav active="analysis" />
    </div>
  );
}
