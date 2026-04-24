import React from "react";
import { Badge } from "../../../shared/ui";
import {
  Mail,
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

const BadgeDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Pill Shape (Rounded)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge rounded>Default</Badge>
          <Badge variant="success" rounded>
            Success
          </Badge>
          <Badge variant="danger" rounded>
            Danger
          </Badge>
          <Badge variant="warning" rounded>
            Warning
          </Badge>
          <Badge variant="info" rounded>
            Info
          </Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge size="sm" variant="info">
            Small
          </Badge>
          <Badge size="md" variant="info">
            Medium
          </Badge>
          <Badge size="lg" variant="info">
            Large
          </Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Dots & Status</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Standalone Dots</span>
            <div className="flex gap-4">
              <Badge dot variant="success" rounded />
              <Badge dot variant="danger" rounded pulse />
              <Badge dot variant="warning" rounded />
              <Badge dot variant="info" rounded pulse />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Dots with Label</span>
            <div className="flex gap-4">
              <Badge dot variant="success" rounded>
                Online
              </Badge>
              <Badge dot variant="danger" rounded pulse>
                Live
              </Badge>
              <Badge dot variant="warning" rounded>
                Away
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Notification Counts</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="relative inline-block">
            <Bell className="w-6 h-6 text-gray-600" />
            <Badge
              count={5}
              variant="danger"
              size="sm"
              rounded
              className="absolute -top-2 -right-2 border-2 border-white"
            />
          </div>
          <Badge count={12} variant="info" rounded />
          <Badge count={120} maxCount={99} variant="info" rounded />
          <Badge count={0} showZero variant="default" rounded />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">With Icons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="success" icon={<CheckCircle size={14} />}>
            Verified
          </Badge>
          <Badge variant="danger" icon={<XCircle size={14} />}>
            Rejected
          </Badge>
          <Badge variant="warning" icon={<AlertTriangle size={14} />}>
            Attention
          </Badge>
          <Badge variant="info" icon={<Info size={14} />}>
            Details
          </Badge>
          <Badge variant="default" icon={<Mail size={14} />}>
            Messages
          </Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Theme Customization</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge
            variant="success"
            theme={{ success: "bg-indigo-100 text-indigo-700" }}
          >
            Custom Success (Indigo)
          </Badge>
          <Badge
            variant="info"
            className="bg-black text-white hover:bg-gray-800"
          >
            Full Override via ClassName
          </Badge>
        </div>
      </section>
    </div>
  );
};

export default BadgeDemo;
