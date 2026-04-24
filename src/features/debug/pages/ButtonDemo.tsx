import React from "react";
import { Button } from "../../../shared/ui";

const ButtonDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-[#0b0f1a] min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Buttons</h2>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-8">
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">Variants</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">Sizes</p>
            <div className="flex items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">States</p>
            <div className="flex gap-4">
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">Custom Colors & Theme Overrides</p>
            <div className="flex flex-wrap gap-4">
              <Button 
                theme={{ primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600" }}
              >
                Custom Blue
              </Button>
              <Button 
                theme={{ primary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-xl shadow-purple-500/30" }}
              >
                Custom Purple
              </Button>
              <Button 
                variant="outline"
                theme={{ outline: "bg-transparent text-pink-600 border-2 border-pink-600 hover:bg-pink-50 focus:ring-pink-500 dark:hover:bg-pink-950" }}
              >
                Custom Outline
              </Button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ButtonDemo;
