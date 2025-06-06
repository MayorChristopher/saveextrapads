import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

const Calculator = () => {
  const [usage, setUsage] = useState({
    padsPerDay: 4,
    daysPerCycle: 5,
    cyclesPerYear: 12,
  });

  const [showResults, setShowResults] = useState(false);

  const calculateSavings = () => {
    const pads = parseInt(usage.padsPerDay) || 0;
    const days = parseInt(usage.daysPerCycle) || 0;
    const cycles = parseInt(usage.cyclesPerYear) || 0;

    const traditionalCost = pads * days * cycles * 0.3;
    const ecoFriendlyCost = pads * days * cycles * 0.2;
    const savings = traditionalCost - ecoFriendlyCost;

    return {
      traditional: traditionalCost,
      ecoFriendly: ecoFriendlyCost,
      savings: savings,
    };
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Savings Calculator</h1>
            <p className="text-lg text-gray-600">
              Calculate your potential savings with SaveExtraPad
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 rounded-xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Average pads used per day
                  </label>
                  <input
                    type="number"
                    value={usage.padsPerDay}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUsage({
                        ...usage,
                        padsPerDay: value === "" ? "" : parseInt(value, 10),
                      });
                    }}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Days per cycle
                  </label>
                  <input
                    type="number"
                    value={usage.daysPerCycle}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUsage({
                        ...usage,
                        daysPerCycle: value === "" ? "" : parseInt(value, 10),
                      });
                    }}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cycles per year
                  </label>
                  <input
                    type="number"
                    value={usage.cyclesPerYear}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUsage({
                        ...usage,
                        cyclesPerYear: value === "" ? "" : parseInt(value, 10),
                      });
                    }}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max="15"
                  />
                </div>

                <Button className="w-full" onClick={() => setShowResults(true)}>
                  <CalculatorIcon className="mr-2 h-4 w-4" />
                  Calculate Savings
                </Button>
              </div>

              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-secondary rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-4">Your Annual Savings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Traditional Pads Cost:</span>
                      <span>{formatCurrency(calculateSavings().traditional)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SaveExtraPad Cost:</span>
                      <span>{formatCurrency(calculateSavings().ecoFriendly)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total Savings:</span>
                      <span>{formatCurrency(calculateSavings().savings)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculator;