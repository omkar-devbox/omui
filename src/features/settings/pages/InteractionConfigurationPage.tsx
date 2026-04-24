import React, { useState } from "react";
import { useInteractionStore } from "../../../shared/settings/interactionStore";
import { Button, Alert, Tooltip, Badge } from "../../../shared/ui";
import { ShortcutCapture } from "../components/ShortcutCapture";
import {
  Save,
  RefreshCw,
  Keyboard,
  MousePointer2,
  Navigation,
  HelpCircle,
  Command,
  Layout,
  FormInput,
  Search,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type {
  ShortcutAction,
  BaseShortcutAction,
} from "../../../shared/settings/types";

interface ShortcutGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: ShortcutAction[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Global Actions",
    description: "Primary actions used across most forms and data views.",
    icon: <MousePointer2 className="w-5 h-5" />,
    actions: ["save", "submit", "cancel", "reset"],
  },
  {
    title: "Form Controls",
    description: "Manage how forms are opened, closed, and navigated.",
    icon: <FormInput className="w-5 h-5" />,
    actions: ["openForm", "closeForm", "toggleForm"],
  },
  {
    title: "Navigation & Routes",
    description: "Jump between main application sections and control history.",
    icon: <Navigation className="w-5 h-5" />,
    actions: [
      "navDashboard",
      "navSettings",
      "navCreate",
      "navBack",
      "navForward",
      "quickNav",
    ],
  },
];

const ACTION_LABELS: Record<ShortcutAction, string> = {
  save: "Save Action",
  submit: "Submit Form",
  cancel: "Cancel/Escape",
  reset: "Reset Form",
  openForm: "Open New Form",
  closeForm: "Close Form",
  toggleForm: "Toggle Form",
  navDashboard: "Go to Dashboard",
  navSettings: "Go to Settings",
  navCreate: "Go to Create Page",
  navBack: "Go Back",
  navForward: "Go Forward",
  quickNav: "Command Palette",
};

const ACTION_HINTS: Record<ShortcutAction, string> = {
  save: "Triggers the save sequence for the active document or form.",
  submit: "Finalizes and submits the current form data.",
  cancel: "Exits the current context, modal, or clears active selection.",
  reset: "Reverts the current form fields to their initial states.",
  openForm: "Quickly triggers the 'Create' or 'New Item' modal.",
  closeForm: "Closes the currently active form or side panel.",
  toggleForm: "Quickly switches the visibility of the primary action form.",
  navDashboard: "Instantly navigates back to the main dashboard view.",
  navSettings: "Opens the application settings dashboard.",
  navCreate: "Takes you directly to the resource creation page.",
  navBack: "Navigates to the previous page in history.",
  navForward: "Navigates to the next page in history.",
  quickNav: "Opens the global search and command palette (Coming soon).",
};

export const InteractionConfigurationPage: React.FC = () => {
  const {
    mappings,
    customNavs,
    updateMapping,
    addCustomNav,
    updateCustomNav,
    removeCustomNav,
    resetToDefault,
  } = useInteractionStore();
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNav, setIsAddingNav] = useState(false);
  const [newNav, setNewNav] = useState({ label: "", path: "" });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddNav = () => {
    if (!newNav.label || !newNav.path) return;
    addCustomNav({ ...newNav, keys: [] });
    setNewNav({ label: "", path: "" });
    setIsAddingNav(false);
  };

  const filteredGroups = SHORTCUT_GROUPS.map((group) => ({
    ...group,
    actions: group.actions.filter(
      (action) =>
        ACTION_LABELS[action]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ACTION_HINTS[action].toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((group) => group.actions.length > 0);

  // Check for conflicts
  const getConflict = (action: ShortcutAction, keys: string[]) => {
    if (keys.length === 0) return null;
    const keyStr = keys.sort().join("+");

    for (const [otherAction, mapping] of Object.entries(mappings)) {
      if (otherAction === action) continue;
      if (mapping.keys.sort().join("+") === keyStr) {
        return (ACTION_LABELS[otherAction as BaseShortcutAction] ||
          otherAction) as string;
      }
    }

    for (const nav of customNavs) {
      if (nav.id === action) continue;
      if (nav.keys.sort().join("+") === keyStr) {
        return nav.label;
      }
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-button-primary/10 rounded-2xl flex items-center justify-center text-button-primary">
            <Command className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary transition-colors">
              Interactions & Shortcuts
            </h1>
            <p className="text-text-secondary mt-1">
              Configure keyboard shortcuts, form behaviors, and navigation.
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {isSaved && (
            <span className="text-sm font-medium text-success animate-in fade-in">
              Saved successfully!
            </span>
          )}
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={resetToDefault}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Search and Filters */}
          <div className="bg-card-bg p-4 rounded-2xl shadow-sm border border-card-border flex items-center gap-3">
            <Search className="w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search actions or shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-text-primary focus:ring-0 placeholder:text-text-muted transition-colors"
            />
          </div>

          {filteredGroups.map((group) => (
            <div
              key={group.title}
              className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-card-border pb-4">
                <div className="p-2 bg-neutral-bg rounded-lg text-text-secondary">
                  {group.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    {group.title}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {group.description}
                  </p>
                </div>
                {group.title === "Navigation & Routes" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-auto"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => setIsAddingNav(true)}
                  >
                    Add Custom
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {isAddingNav && group.title === "Navigation & Routes" && (
                  <div className="md:col-span-2 bg-neutral-bg p-4 rounded-xl border-2 border-button-primary/30 space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-text-primary">
                        Add Custom Navigation
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingNav(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary">
                          Label
                        </label>
                        <input
                          className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-button-primary"
                          placeholder="e.g. My Profile"
                          value={newNav.label}
                          onChange={(e) =>
                            setNewNav((prev) => ({
                              ...prev,
                              label: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary">
                          Path/URL
                        </label>
                        <input
                          className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-button-primary"
                          placeholder="e.g. /profile"
                          value={newNav.path}
                          onChange={(e) =>
                            setNewNav((prev) => ({
                              ...prev,
                              path: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddNav}
                      >
                        Create Navigation Action
                      </Button>
                    </div>
                  </div>
                )}

                {group.actions.map((action) => {
                  const conflict = getConflict(
                    action,
                    mappings[action as BaseShortcutAction].keys,
                  );
                  return (
                    <div key={action} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-text-primary">
                            {ACTION_LABELS[action]}
                          </span>
                          <Tooltip content={ACTION_HINTS[action]}>
                            <HelpCircle className="w-3.5 h-3.5 text-text-muted hover:text-text-secondary cursor-help transition-colors" />
                          </Tooltip>
                        </div>
                        {conflict && (
                          <Badge
                            variant="warning"
                            className="text-[10px] py-0 px-1.5 animate-pulse"
                          >
                            Conflict: {ACTION_LABELS[conflict]}
                          </Badge>
                        )}
                      </div>
                      <ShortcutCapture
                        value={mappings[action as BaseShortcutAction].keys}
                        onChange={(keys) =>
                          updateMapping(action as BaseShortcutAction, keys)
                        }
                      />
                    </div>
                  );
                })}

                {/* Custom Navigation Items */}
                {group.title === "Navigation & Routes" &&
                  customNavs.map((nav) => {
                    const conflict = getConflict(nav.id, nav.keys);
                    return (
                      <div
                        key={nav.id}
                        className="space-y-2 group/nav relative bg-neutral-bg/30 p-3 rounded-xl border border-transparent hover:border-card-border transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-text-primary truncate">
                                {nav.label}
                              </span>
                              <span className="text-[10px] text-text-muted flex items-center gap-1">
                                <ExternalLink className="w-2.5 h-2.5" />
                                {nav.path}
                              </span>
                            </div>
                            <Tooltip content={`Navigates to: ${nav.path}`}>
                              <HelpCircle className="w-3.5 h-3.5 text-text-muted hover:text-text-secondary cursor-help transition-colors" />
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-2">
                            {conflict && (
                              <Badge
                                variant="warning"
                                className="text-[10px] py-0 px-1.5"
                              >
                                Conflict: {conflict}
                              </Badge>
                            )}
                            <button
                              onClick={() => removeCustomNav(nav.id)}
                              className="p-1 text-text-muted hover:text-error opacity-0 group-hover/nav:opacity-100 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <ShortcutCapture
                          value={nav.keys}
                          onChange={(keys) => updateCustomNav(nav.id, { keys })}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="bg-card-bg p-12 rounded-2xl border border-dashed border-card-border text-center">
              <Keyboard className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-text-secondary">
                No matching shortcuts found
              </h3>
              <p className="text-text-muted">
                Try adjusting your search query.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border sticky top-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-button-primary" />
              Quick Reference
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                Customize how you interact with the application. These shortcuts
                work globally but respect context (e.g., forms must be focused
                for form actions).
              </p>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest pt-2">
                  Modifiers Supported
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Control</Badge>
                  <Badge variant="default">Alt</Badge>
                  <Badge variant="default">Shift</Badge>
                  <Badge variant="default">Command (Mac)</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-border">
                <Alert type="info" title="Pro Tip">
                  Use{" "}
                  <kbd className="px-1 py-0.5 rounded border border-neutral-border bg-neutral-bg text-[10px]">
                    Esc
                  </kbd>{" "}
                  anytime to cancel recording or close active panels.
                </Alert>
              </div>

              <div className="pt-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
                  System Defaults
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Save Action</span>
                    <span className="text-text-primary font-mono bg-neutral-bg px-1 rounded">
                      Ctrl + S
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Submit Form</span>
                    <span className="text-text-primary font-mono bg-neutral-bg px-1 rounded">
                      Ctrl + Enter
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Dashboard</span>
                    <span className="text-text-primary font-mono bg-neutral-bg px-1 rounded">
                      Ctrl + D
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
