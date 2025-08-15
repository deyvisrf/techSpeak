"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";

export function FreemiumBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-fuchsia-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⭐</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Upgrade para Premium
              </h3>
              <p className="text-xs text-gray-600">
                Sessões ilimitadas do Coach + feedback avançado de pronúncia
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              className="text-xs"
              onClick={() => alert("Em breve! 🚀")}
            >
              Upgrade
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Coach gratuito</span>
            <span>7/10 sessões usadas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: "70%" }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

