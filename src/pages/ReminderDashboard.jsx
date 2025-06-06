import React, { useState } from "react";
import { useAuth } from "@/store/auth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReminderSetup from "@/components/Reminder/ReminderSetup";
import ReminderHistory from "@/components/Reminder/ReminderHistory";
import Calculator from "@/components/Calculator/Calculator";

const ReminderDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState("setup");

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return (
    <div className="section-padding container-custom">
      <h1 className="text-3xl font-bold text-center mb-6">Cycle Tools</h1>

      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="setup">Set Reminder</TabsTrigger>
          <TabsTrigger value="history">Reminder History</TabsTrigger>
          <TabsTrigger value="calculator">Savings Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <ReminderSetup />
        </TabsContent>

        <TabsContent value="history">
          <ReminderHistory />
        </TabsContent>

        <TabsContent value="calculator">
          <Calculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReminderDashboard;
