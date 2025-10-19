import React, { useState } from "react";
import Header from "../components/Header/Header";
import BalanceCard from "../components/BalanceCard/BalanceCard";
import StatsSection from "../components/StatsSection/StatsSection";
import ActivitySection from "../components/ActivitySection/ActivitySection";
import BottomNav from "../components/BottomNav/BottomNav";

export default function Home(){
  const [balance, setBalance] = useState("452,780 ₸");

  const updateBalance = () => {
    setBalance("453,120 ₸");
    setTimeout(()=> setBalance("452,780 ₸"), 2000);
  };

  return (
    <div className="page">
      <Header balance={balance} />
      <BalanceCard balance={balance} onClick={updateBalance} />
      <StatsSection />
      <ActivitySection />
      <BottomNav active="home" />
    </div>
  );
}
