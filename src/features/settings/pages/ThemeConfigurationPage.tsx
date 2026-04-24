import React, { useState } from "react";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { Button, FormField, Alert, Badge, Tooltip } from "../../../shared/ui";
import type { ThemeColors } from "../../../shared/theme/types";
import { Save, RefreshCw, Sun, Moon, HelpCircle } from "lucide-react";

interface ColorGroup {
  title: string;
  description?: string;
  keys: (keyof ThemeColors)[];
  labels?: Partial<Record<keyof ThemeColors, string>>;
  hints?: Partial<Record<keyof ThemeColors, string>>;
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    title: "Global Text & Labels",
    description:
      "Core typography and input label colors used across the entire application.",
    keys: [
      "textPrimary",
      "textSecondary",
      "textMuted",
      "labelDefault",
      "labelFocus",
      "labelDisabled",
    ],
    labels: {
      textPrimary: "Heading & Main Text",
      textSecondary: "Secondary Text",
      textMuted: "Muted Text",
      labelDefault: "Label Default",
      labelFocus: "Label Focus",
      labelDisabled: "Label Disabled",
    },
    hints: {
      textPrimary: "Main text color for headings and core content.",
      textSecondary: "Used for subheadings and less prominent content.",
      textMuted: "Subtle text for captions, hints, and metadata.",
      labelDefault: "Standard color for input field labels.",
      labelFocus: "Label color when the associated input is centered/active.",
      labelDisabled: "Label color for fields that cannot be edited.",
    },
  },
  {
    title: "Navigation & Shell",
    description:
      "Colors for the structural elements like sidebar, topbar, and main background.",
    keys: ["navBg", "navHover", "navActiveBg", "neutralBg"],
    labels: {
      navBg: "Navigation Background",
      navHover: "Navigation Hover",
      navActiveBg: "Active Item Background",
      neutralBg: "Main Page Background",
    },
    hints: {
      navBg: "Background color of the sidebar and top navigation bars.",
      navHover: "Highlight color when hovering over navigation links.",
      navActiveBg: "Background for the currently selected navigation item.",
      neutralBg: "The main background color of the app's content area.",
    },
  },
  {
    title: "Cards & Surfaces",
    description:
      "Backgrounds and borders for panels, cards, and other UI containers.",
    keys: ["cardBg", "cardBorder", "neutralSurface", "neutralBorder"],
    labels: {
      cardBg: "Card Background",
      cardBorder: "Card Border",
      neutralSurface: "Secondary Surface",
      neutralBorder: "Default Border",
    },
    hints: {
      cardBg: "Primary background for cards and elevated components.",
      cardBorder: "Subtle border color for defined containers.",
      neutralSurface: "Secondary background used for panels or shaded areas.",
      neutralBorder: "Standard border color for generic UI elements.",
    },
  },
  {
    title: "Tables",
    description: "Colors specifically tailored for data grid headers and rows.",
    keys: [
      "tableHeaderBg",
      "tableRowHover",
      "tableBg",
      "tableBorder",
      "tableToolbarBg",
    ],
    labels: {
      tableHeaderBg: "Header Background",
      tableRowHover: "Row Hover Highlight",
      tableBg: "Main Background",
      tableBorder: "Grid/Cell Border",
      tableToolbarBg: "Toolbar Background",
    },
    hints: {
      tableHeaderBg: "Background color for the header row of data tables.",
      tableRowHover: "Background highlight when hovering over data rows.",
      tableBg: "The primary background for the table container.",
      tableBorder: "Color for cell borders and the outer table frame.",
      tableToolbarBg: "Background for the search and export toolbar area.",
    },
  },
  {
    title: "Inputs & Fields",
    description:
      "Colors for text inputs, select boxes, and other form elements.",
    keys: [
      "inputBg",
      "inputText",
      "inputBorderDefault",
      "inputBorderFocus",
      "inputBgDisabled",
    ],
    labels: {
      inputBg: "Field Background",
      inputText: "Field Text",
      inputBorderDefault: "Field Border",
      inputBorderFocus: "Field Focus Border",
      inputBgDisabled: "Disabled Background",
    },
    hints: {
      inputBg: "Background color for text inputs and textareas.",
      inputText: "Color of the text typed inside input fields.",
      inputBorderDefault: "Default border color for input components.",
      inputBorderFocus: "Border color when an input has keyboard focus.",
      inputBgDisabled: "Restricted background color for disabled inputs.",
    },
  },
  {
    title: "Buttons",
    description:
      "Action button variants including primary, secondary, and danger states.",
    keys: [
      "buttonPrimary",
      "buttonPrimaryHover",
      "buttonSecondary",
      "buttonSecondaryHover",
      "buttonDanger",
      "buttonDangerHover",
      "buttonDisabled",
      "buttonBorder",
    ],
    labels: {
      buttonPrimary: "Primary Button",
      buttonPrimaryHover: "Primary Hover",
      buttonSecondary: "Secondary/Ghost",
      buttonSecondaryHover: "Secondary Hover",
      buttonDanger: "Danger Button",
      buttonDangerHover: "Danger Hover",
      buttonDisabled: "Disabled Button",
      buttonBorder: "Button Border",
    },
    hints: {
      buttonPrimary: "Background color for main action buttons.",
      buttonPrimaryHover: "Color when hovering over the primary button.",
      buttonSecondary: "Background for secondary or ghost-style buttons.",
      buttonSecondaryHover: "Color when hovering over secondary buttons.",
      buttonDanger: "Color for destructive or high-risk action buttons.",
      buttonDangerHover: "Color when hovering over danger buttons.",
      buttonDisabled: "Color applied to buttons in an inactive state.",
      buttonBorder: "Border color for outline and secondary button variants.",
    },
  },
  {
    title: "Status & Semantic",
    description:
      "Colors for communicating meaning, such as success, error, or information.",
    keys: [
      "error",
      "errorBg",
      "success",
      "successLight",
      "warning",
      "warningLight",
      "info",
      "infoLight",
    ],
    labels: {
      error: "Error Primary",
      errorBg: "Error Background",
      success: "Success Primary",
      successLight: "Success Background",
      warning: "Warning Primary",
      warningLight: "Warning Background",
      info: "Info Primary",
      infoLight: "Info Background",
    },
    hints: {
      error: "The primary color for validation errors and alerts.",
      errorBg: "Subtle background for error messages and toast alerts.",
      success: "Color used for successful operations and completion.",
      successLight: "Subtle background for success messages.",
      warning: "Color used for items requiring caution or attention.",
      warningLight: "Subtle background for warning indicators.",
      info: "Color for informational elements and guidance.",
      infoLight: "Subtle background for informational messages.",
    },
  },
];

export const ThemeConfigurationPage: React.FC = () => {
  const { theme, setTheme, lightColors, darkColors, setColors, resetColors } =
    useTheme();
  const [isSaved, setIsSaved] = useState(false);

  const [editMode, setEditMode] = useState<"light" | "dark">(() => {
    const isDark =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : theme === "dark";
    return isDark ? "dark" : "light";
  });

  const handleModeSwitch = (mode: "light" | "dark") => {
    setEditMode(mode);
    setTheme(mode); // Force the whole app into that mode to preview accurately
  };

  const currentColors = editMode === "light" ? lightColors : darkColors;

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors({ [key]: value }, editMode);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border">
        <div>
          <h1 className="text-3xl font-bold text-text-primary transition-colors">
            Theme Configuration
          </h1>
          <p className="text-text-secondary mt-1">
            Customize and manage all UI colors globally.
          </p>
          <div className="mt-4 flex bg-neutral-bg p-1 rounded-lg w-fit border border-neutral-border">
            <button
              onClick={() => handleModeSwitch("light")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                editMode === "light"
                  ? "bg-neutral-surface shadow text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Sun className="w-4 h-4" /> Light Mode
            </button>
            <button
              onClick={() => handleModeSwitch("dark")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                editMode === "dark"
                  ? "bg-neutral-surface shadow text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Moon className="w-4 h-4" /> Dark Mode
            </button>
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
            onClick={resetColors}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Color Variables - {editMode === "light" ? "Light" : "Dark"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {COLOR_GROUPS.map((group) => (
                <div key={group.title} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                      {group.title}
                    </h3>
                    {group.description && (
                      <Tooltip content={group.description} placement="top">
                        <HelpCircle className="w-4 h-4 text-text-muted hover:text-text-secondary transition-colors cursor-help" />
                      </Tooltip>
                    )}
                  </div>
                  <div className="space-y-3">
                    {group.keys.map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-1.5">
                          <label
                            className="text-sm font-medium text-text-primary"
                            htmlFor={`color-${key}`}
                          >
                            {group.labels?.[key] ||
                              key.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          {group.hints?.[key] && (
                            <Tooltip
                              content={group.hints[key]}
                              placement="right"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-text-muted hover:text-text-secondary cursor-help transition-colors" />
                            </Tooltip>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={
                              currentColors[key as keyof ThemeColors] || ""
                            }
                            onChange={(e) =>
                              handleColorChange(
                                key as keyof ThemeColors,
                                e.target.value,
                              )
                            }
                            className="w-20 text-xs px-2 py-1 border border-neutral-border rounded text-text-primary bg-neutral-surface"
                          />
                          <input
                            id={`color-${key}`}
                            type="color"
                            value={
                              currentColors[key as keyof ThemeColors] || ""
                            }
                            onChange={(e) =>
                              handleColorChange(
                                key as keyof ThemeColors,
                                e.target.value,
                              )
                            }
                            className="h-8 w-12 cursor-pointer border-0 p-0 rounded overflow-hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border sticky top-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Live Preview
            </h2>

            <div className="space-y-6">
              {/* Form Preview */}
              <div className="p-5 border border-neutral-border rounded-xl bg-neutral-bg space-y-4">
                <h3 className="text-sm font-medium text-text-secondary">
                  Input Components
                </h3>

                <FormField
                  type="text"
                  label="Name (Default)"
                  placeholder="Enter your name"
                />

                <FormField
                  type="email"
                  label="Email (Focus demo)"
                  placeholder="focus to see primary color"
                />

                <FormField
                  type="text"
                  label="Username (Error)"
                  placeholder="Invalid username"
                  error="This username is already taken."
                  value="invaliduser"
                  onChange={() => {}}
                />

                <FormField
                  type="text"
                  label="Disabled Field"
                  placeholder="Cannot edit this"
                  disabled
                />
              </div>

              {/* Button Preview */}
              <div className="p-5 border border-neutral-border rounded-xl bg-neutral-bg space-y-4">
                <h3 className="text-sm font-medium text-text-secondary">
                  Button Components
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="danger">Danger Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
              </div>

              {/* Status Preview */}
              <div className="p-5 border border-neutral-border rounded-xl bg-neutral-bg space-y-4">
                <h3 className="text-sm font-medium text-text-secondary">
                  Validation & Alerts
                </h3>
                <Alert type="success" title="Success" closable>
                  Your changes have been successfully saved!
                </Alert>
                <Alert type="error" title="Error" closable>
                  Failed to save configuration. Check inputs.
                </Alert>
                <Alert type="warning" title="Warning" closable>
                  This color contrast may not be perfectly readable.
                </Alert>
                <Alert type="info" title="Information" closable>
                  Changes are persisted automatically.
                </Alert>

                <div className="flex gap-2 flex-wrap pt-2">
                  <Badge variant="success">Success</Badge>
                  <Badge variant="danger">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="default">Default</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
