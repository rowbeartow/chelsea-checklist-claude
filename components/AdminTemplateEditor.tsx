"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  FileText,
  GripVertical,
  Layers3,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  UserRound,
  UsersRound
} from "lucide-react";
import { getJourneyLabel } from "@/lib/checklist";
import type { ChecklistStage, ChecklistTask, ClientChecklist, MasterTemplate, Vendor } from "@/lib/types";
import { RichContent } from "@/components/RichContent";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ClientManager } from "@/components/ClientManager";
import { VendorLibraryManager } from "@/components/VendorLibraryManager";

type EditableTask = ChecklistTask & {
  archived?: boolean;
};

type EditableStage = Omit<ChecklistStage, "tasks"> & {
  tasks: EditableTask[];
  archived?: boolean;
};

type EditableTemplate = Omit<MasterTemplate, "stages"> & {
  stages: EditableStage[];
};

type AdminTemplateEditorProps = {
  initialTemplates: MasterTemplate[];
  clients: ClientChecklist[];
  vendors: Vendor[];
  authMode: "demo" | "authenticated";
  adminEmail?: string;
};

const sections = [
  { label: "Clients", icon: UsersRound },
  { label: "Templates", icon: Layers3 },
  { label: "Vendors", icon: UserRound },
  { label: "Settings", icon: Settings }
];

type AdminSection = (typeof sections)[number]["label"];

function cloneTemplates(templates: MasterTemplate[]): EditableTemplate[] {
  return templates.map((template) => ({
    ...template,
    stages: template.stages.map((stage) => ({
      ...stage,
      archived: false,
      tasks: stage.tasks.map((task) => ({
        ...task,
        archived: false
      }))
    }))
  }));
}

function makeRichContentFromText(text: string) {
  return {
    json: {
      type: "doc",
      content: []
    },
    html: text
  };
}

function getPlainTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

export function AdminTemplateEditor({
  initialTemplates,
  clients,
  vendors,
  authMode,
  adminEmail
}: AdminTemplateEditorProps) {
  const [templates, setTemplates] = useState<EditableTemplate[]>(() => cloneTemplates(initialTemplates));
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplates[0]?.id ?? "");
  const [selectedStageId, setSelectedStageId] = useState(initialTemplates[0]?.stages[0]?.id ?? "");
  const [selectedTaskId, setSelectedTaskId] = useState(initialTemplates[0]?.stages[0]?.tasks[0]?.id ?? "");
  const [showArchived, setShowArchived] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("Templates");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const activeStages = selectedTemplate?.stages.filter((stage) => !stage.archived) ?? [];
  const listedStages = selectedTemplate?.stages.filter((stage) => showArchived || !stage.archived) ?? [];
  const selectedStage =
    selectedTemplate?.stages.find((stage) => stage.id === selectedStageId) ??
    activeStages[0] ??
    selectedTemplate?.stages[0];
  const activeTasks = selectedStage?.tasks.filter((task) => !task.archived) ?? [];
  const listedTasks = selectedStage?.tasks.filter((task) => showArchived || !task.archived) ?? [];
  const selectedTask =
    selectedStage?.tasks.find((task) => task.id === selectedTaskId) ?? activeTasks[0] ?? selectedStage?.tasks[0];

  const stats = useMemo(() => {
    const stageCount = selectedTemplate?.stages.filter((stage) => !stage.archived).length ?? 0;
    const taskCount =
      selectedTemplate?.stages.reduce(
        (count, stage) => count + stage.tasks.filter((task) => !task.archived).length,
        0
      ) ?? 0;

    return { stageCount, taskCount };
  }, [selectedTemplate]);

  function updateTemplate(updater: (template: EditableTemplate) => EditableTemplate) {
    setTemplates((current) =>
      current.map((template) => (template.id === selectedTemplateId ? updater(template) : template))
    );
  }

  function updateSelectedStage(updater: (stage: EditableStage) => EditableStage) {
    updateTemplate((template) => ({
      ...template,
      stages: template.stages.map((stage) => (stage.id === selectedStage?.id ? updater(stage) : stage))
    }));
  }

  function updateSelectedTask(updater: (task: EditableTask) => EditableTask) {
    updateSelectedStage((stage) => ({
      ...stage,
      tasks: stage.tasks.map((task) => (task.id === selectedTask?.id ? updater(task) : task))
    }));
  }

  function selectTemplate(templateId: string) {
    const nextTemplate = templates.find((template) => template.id === templateId);
    const nextStage = nextTemplate?.stages.find((stage) => !stage.archived) ?? nextTemplate?.stages[0];
    const nextTask = nextStage?.tasks.find((task) => !task.archived) ?? nextStage?.tasks[0];

    setSelectedTemplateId(templateId);
    setSelectedStageId(nextStage?.id ?? "");
    setSelectedTaskId(nextTask?.id ?? "");
  }

  function selectStage(stageId: string) {
    const nextStage = selectedTemplate?.stages.find((stage) => stage.id === stageId);
    const nextTask = nextStage?.tasks.find((task) => !task.archived) ?? nextStage?.tasks[0];

    setSelectedStageId(stageId);
    setSelectedTaskId(nextTask?.id ?? "");
  }

  function addStage() {
    const nextStage: EditableStage = {
      id: crypto.randomUUID(),
      title: "New stage",
      shortDescription: "Add a short client-facing summary.",
      richContent: makeRichContentFromText("<p>Add Chelsea's stage guidance here.</p>"),
      sortOrder: (selectedTemplate?.stages.length ?? 0) + 1,
      isCurrent: false,
      archived: false,
      vendorRecommendations: [],
      tasks: []
    };

    updateTemplate((template) => ({
      ...template,
      stages: [...template.stages, nextStage]
    }));
    setSelectedStageId(nextStage.id);
    setSelectedTaskId("");
  }

  function addTask() {
    if (!selectedStage) {
      return;
    }

    const nextTask: EditableTask = {
      id: crypto.randomUUID(),
      title: "New task",
      helperText: "Add a short checklist-row helper.",
      richContent: makeRichContentFromText("<p>Add Chelsea's task detail here.</p>"),
      isRequired: true,
      sortOrder: selectedStage.tasks.length + 1,
      isComplete: false,
      archived: false,
      vendorRecommendations: []
    };

    updateSelectedStage((stage) => ({
      ...stage,
      tasks: [...stage.tasks, nextTask]
    }));
    setSelectedTaskId(nextTask.id);
  }

  function moveStage(direction: -1 | 1) {
    if (!selectedStage) {
      return;
    }

    updateTemplate((template) => {
      const index = template.stages.findIndex((stage) => stage.id === selectedStage.id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= template.stages.length) {
        return template;
      }

      const stages = [...template.stages];
      [stages[index], stages[nextIndex]] = [stages[nextIndex], stages[index]];

      return {
        ...template,
        stages: stages.map((stage, sortIndex) => ({
          ...stage,
          sortOrder: sortIndex + 1
        }))
      };
    });
  }

  function moveTask(direction: -1 | 1) {
    if (!selectedTask) {
      return;
    }

    updateSelectedStage((stage) => {
      const index = stage.tasks.findIndex((task) => task.id === selectedTask.id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= stage.tasks.length) {
        return stage;
      }

      const tasks = [...stage.tasks];
      [tasks[index], tasks[nextIndex]] = [tasks[nextIndex], tasks[index]];

      return {
        ...stage,
        tasks: tasks.map((task, sortIndex) => ({
          ...task,
          sortOrder: sortIndex + 1
        }))
      };
    });
  }

  function archiveStage() {
    if (!selectedStage) {
      return;
    }

    updateSelectedStage((stage) => ({
      ...stage,
      archived: true
    }));

    const nextStage = activeStages.find((stage) => stage.id !== selectedStage.id);
    setSelectedStageId(nextStage?.id ?? "");
    setSelectedTaskId(nextStage?.tasks.find((task) => !task.archived)?.id ?? "");
  }

  function deleteStage() {
    if (!selectedStage) {
      return;
    }

    updateTemplate((template) => ({
      ...template,
      stages: template.stages.filter((stage) => stage.id !== selectedStage.id)
    }));

    const nextStage = activeStages.find((stage) => stage.id !== selectedStage.id);
    setSelectedStageId(nextStage?.id ?? "");
    setSelectedTaskId(nextStage?.tasks.find((task) => !task.archived)?.id ?? "");
  }

  function archiveTask() {
    if (!selectedTask) {
      return;
    }

    updateSelectedTask((task) => ({
      ...task,
      archived: true
    }));

    const nextTask = activeTasks.find((task) => task.id !== selectedTask.id);
    setSelectedTaskId(nextTask?.id ?? "");
  }

  function deleteTask() {
    if (!selectedTask) {
      return;
    }

    updateSelectedStage((stage) => ({
      ...stage,
      tasks: stage.tasks.filter((task) => task.id !== selectedTask.id)
    }));

    const nextTask = activeTasks.find((task) => task.id !== selectedTask.id);
    setSelectedTaskId(nextTask?.id ?? "");
  }

  async function saveSelectedTemplate() {
    if (!selectedTemplate) {
      return;
    }

    setIsSavingTemplate(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/admin/templates", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(selectedTemplate)
      });
      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setSaveMessage(payload.error ?? "Template save failed.");
        return;
      }

      setLastSavedAt(getPlainTimestamp());
      setSaveMessage(payload.message ?? "Template saved.");
    } catch {
      setSaveMessage("Template save failed.");
    } finally {
      setIsSavingTemplate(false);
    }
  }

  return (
    <main className="min-h-screen bg-cloud px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-line bg-white p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink font-bold text-white">C</div>
            <div>
              <p className="text-sm font-bold">Chelsea Admin</p>
              <p className="text-xs text-ink/60">{adminEmail ?? "Template editor"}</p>
            </div>
          </div>
          <nav className="mt-5 grid gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.label}
                  onClick={() => setActiveSection(section.label)}
                  type="button"
                  className={clsx(
                    "flex items-center gap-3 rounded-md border px-3 py-2 text-left text-sm font-bold",
                    activeSection === section.label
                      ? "border-accent bg-white text-accent"
                      : "border-transparent text-ink/68 hover:bg-cloud"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>

          <Link
            href="/c/demo-buyer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-ink"
          >
            <Eye className="h-4 w-4" />
            Preview client view
          </Link>
        </aside>

        <section className="grid gap-5">
          {activeSection === "Templates" ? (
            <>
          <header className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-accent">Admin</p>
                <h1 className="mt-1 text-3xl font-semibold">Template editor</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/68">
                  Edit buyer and seller master templates — add, reorder, or archive stages and tasks, update content, and preview how it looks to clients.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveSelectedTemplate}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-accent bg-white px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft"
                >
                  <Save className="h-4 w-4" />
                  {isSavingTemplate ? "Saving..." : "Save template"}
                </button>
                <button
                  type="button"
                  onClick={addStage}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-bold hover:border-ink"
                >
                  <Plus className="h-4 w-4" />
                  New stage
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-ink/64">
              <span className="rounded-md bg-cloud px-2 py-1">{stats.stageCount} active stages</span>
              <span className="rounded-md bg-cloud px-2 py-1">{stats.taskCount} active tasks</span>
              {authMode === "demo" ? (
                <span className="rounded-md bg-warningSoft px-2 py-1 text-warning">Demo mode: admin auth disabled</span>
              ) : (
                <span className="rounded-md bg-successSoft px-2 py-1 text-success">Signed in as admin</span>
              )}
              <span className="rounded-md bg-warningSoft px-2 py-1 text-warning">Edits are local until Supabase is connected</span>
              {lastSavedAt ? (
                <span className="rounded-md bg-successSoft px-2 py-1 text-success">Local draft saved at {lastSavedAt}</span>
              ) : null}
              {saveMessage ? <span className="rounded-md bg-cloud px-2 py-1 text-ink/68">{saveMessage}</span> : null}
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
            <div className="grid content-start gap-4">
              <section className="rounded-lg border border-line bg-white p-4 shadow-soft">
                <h2 className="text-sm font-bold uppercase text-ink/58">Master templates</h2>
                <div className="mt-3 grid gap-2">
                  {templates.map((template) => {
                    const stageCount = template.stages.filter((stage) => !stage.archived).length;
                    const taskCount = template.stages.reduce(
                      (count, stage) => count + stage.tasks.filter((task) => !task.archived).length,
                      0
                    );

                    return (
                      <button
                        key={template.id}
                        className={clsx(
                          "rounded-md border p-3 text-left",
                          selectedTemplateId === template.id ? "border-accent bg-white" : "border-line hover:border-ink"
                        )}
                        type="button"
                        onClick={() => selectTemplate(template.id)}
                      >
                        <span className="block text-sm font-bold">{template.name}</span>
                        <span className="mt-1 block text-xs capitalize text-ink/62">
                          {stageCount} stages, {taskCount} tasks, {template.journeyType}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-lg border border-line bg-white p-4 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold uppercase text-ink/58">Stages</h2>
                  <label className="flex items-center gap-2 text-xs font-bold text-ink/58">
                    <input
                      checked={showArchived}
                      className="h-4 w-4 accent-success"
                      onChange={(event) => setShowArchived(event.target.checked)}
                      type="checkbox"
                    />
                    Archived
                  </label>
                </div>
                <div className="mt-3 grid gap-2">
                  {listedStages.map((stage, index) => (
                    <button
                      key={stage.id}
                      className={clsx(
                        "grid grid-cols-[28px_1fr] gap-3 rounded-md border p-3 text-left",
                        selectedStage?.id === stage.id ? "border-accent bg-white" : "border-line hover:border-ink",
                        stage.archived && "opacity-55"
                      )}
                      type="button"
                      onClick={() => selectStage(stage.id)}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cloud text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{stage.title}</span>
                        <span className="mt-1 block text-xs text-ink/62">
                          {stage.tasks.filter((task) => !task.archived).length} active tasks
                        </span>
                      </span>
                    </button>
                  ))}
                  {!listedStages.length ? <p className="text-sm text-ink/62">No stages to show.</p> : null}
                </div>
              </section>

              <section className="rounded-lg border border-line bg-white p-4 shadow-soft">
                <h2 className="text-sm font-bold uppercase text-ink/58">Client checklist types</h2>
                <div className="mt-3 grid gap-2">
                  {clients.map((checklist) => (
                    <div key={checklist.id} className="rounded-md border border-line p-3">
                      <p className="text-sm font-bold">{checklist.clientName}</p>
                      <p className="mt-1 text-xs text-ink/62">{getJourneyLabel(checklist.journeyType)}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-line bg-white p-4 shadow-soft">
                <h2 className="text-sm font-bold uppercase text-ink/58">Vendor library</h2>
                <div className="mt-3 grid gap-2">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-line p-3">
                      <div>
                        <p className="text-sm font-bold">{vendor.name}</p>
                        <p className="text-xs text-ink/62">{vendor.category}</p>
                      </div>
                      <span className="rounded-md bg-successSoft px-2 py-1 text-xs font-bold text-success">Active</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid content-start gap-5">
              <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
                {selectedStage ? (
                  <>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-accent">{selectedTemplate?.name}</p>
                        <h2 className="mt-1 text-2xl font-semibold">Stage content</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                          onClick={() => moveStage(-1)}
                          type="button"
                        >
                          <ArrowUp className="h-4 w-4" />
                          Up
                        </button>
                        <button
                          className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                          onClick={() => moveStage(1)}
                          type="button"
                        >
                          <ArrowDown className="h-4 w-4" />
                          Down
                        </button>
                        {selectedStage.archived ? (
                          <button
                            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                            onClick={() => updateSelectedStage((stage) => ({ ...stage, archived: false }))}
                            type="button"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restore
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                            onClick={archiveStage}
                            type="button"
                          >
                            <Archive className="h-4 w-4" />
                            Archive
                          </button>
                        )}
                        <button
                          className="inline-flex items-center gap-2 rounded-md border border-danger/35 px-3 py-2 text-sm font-bold text-danger"
                          onClick={deleteStage}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4">
                      <label className="grid gap-2 text-sm font-bold">
                        Stage title
                        <input
                          className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                          onChange={(event) => updateSelectedStage((stage) => ({ ...stage, title: event.target.value }))}
                          value={selectedStage.title}
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-bold">
                        Short intro
                        <textarea
                          className="min-h-20 rounded-md border border-line px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-accent"
                          onChange={(event) =>
                            updateSelectedStage((stage) => ({ ...stage, shortDescription: event.target.value }))
                          }
                          value={selectedStage.shortDescription}
                        />
                      </label>
                      <div className="grid gap-2 text-sm font-bold">
                        Stage detail editor
                        <RichTextEditor
                          onChange={(html) =>
                            updateSelectedStage((stage) => ({
                              ...stage,
                              richContent: makeRichContentFromText(html)
                            }))
                          }
                          value={selectedStage.richContent.html}
                        />
                      </div>
                    </div>

                    <div className="detail-panel mt-4 rounded-lg border border-line p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                        <FileText className="h-4 w-4 text-ink/58" />
                        Client preview
                      </div>
                      <RichContent html={selectedStage.richContent.html} />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-ink/62">Add a stage to start editing this template.</p>
                )}
              </section>

              <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-accent">Tasks</p>
                    <h2 className="mt-1 text-2xl font-semibold">{selectedStage?.title ?? "No stage selected"}</h2>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-bold hover:border-ink"
                    disabled={!selectedStage}
                    onClick={addTask}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                    New task
                  </button>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(220px,300px)_1fr]">
                  <div className="grid content-start gap-2">
                    {listedTasks.map((task) => (
                      <button
                        key={task.id}
                        className={clsx(
                          "rounded-md border p-3 text-left",
                          selectedTask?.id === task.id ? "border-accent bg-white" : "border-line hover:border-ink",
                          task.archived && "opacity-55"
                        )}
                        onClick={() => setSelectedTaskId(task.id)}
                        type="button"
                      >
                        <span className="flex items-center gap-2 text-sm font-bold">
                          <GripVertical className="h-4 w-4 text-ink/42" />
                          {task.title}
                        </span>
                        <span className="mt-1 block text-xs text-ink/62">{task.helperText}</span>
                      </button>
                    ))}
                    {!listedTasks.length ? <p className="text-sm text-ink/62">No tasks in this stage yet.</p> : null}
                  </div>

                  {selectedTask ? (
                    <div className="rounded-lg border border-line p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold">{selectedTask.title}</p>
                          <p className="mt-1 text-xs text-ink/62">
                            {selectedTask.isRequired ? "Required task" : "Optional task"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                            onClick={() => moveTask(-1)}
                            type="button"
                          >
                            <ArrowUp className="h-4 w-4" />
                            Up
                          </button>
                          <button
                            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                            onClick={() => moveTask(1)}
                            type="button"
                          >
                            <ArrowDown className="h-4 w-4" />
                            Down
                          </button>
                          {selectedTask.archived ? (
                            <button
                              className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                              onClick={() => updateSelectedTask((task) => ({ ...task, archived: false }))}
                              type="button"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restore
                            </button>
                          ) : (
                            <button
                              className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold"
                              onClick={archiveTask}
                              type="button"
                            >
                              <Archive className="h-4 w-4" />
                              Archive
                            </button>
                          )}
                          <button
                            className="inline-flex items-center gap-2 rounded-md border border-danger/35 px-3 py-2 text-sm font-bold text-danger"
                            onClick={deleteTask}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4">
                        <label className="grid gap-2 text-sm font-bold">
                          Task title
                          <input
                            className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                            onChange={(event) => updateSelectedTask((task) => ({ ...task, title: event.target.value }))}
                            value={selectedTask.title}
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-bold">
                          Checklist helper text
                          <input
                            className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                            onChange={(event) =>
                              updateSelectedTask((task) => ({ ...task, helperText: event.target.value }))
                            }
                            value={selectedTask.helperText}
                          />
                        </label>
                        <label className="flex items-center gap-2 text-sm font-bold">
                          <input
                            checked={selectedTask.isRequired}
                            className="h-4 w-4 accent-success"
                            onChange={(event) =>
                              updateSelectedTask((task) => ({ ...task, isRequired: event.target.checked }))
                            }
                            type="checkbox"
                          />
                          Required task
                        </label>
                        <label className="grid gap-2 text-sm font-bold">
                          When to call Chelsea note
                          <textarea
                            className="min-h-20 rounded-md border border-line px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-accent"
                            onChange={(event) =>
                              updateSelectedTask((task) => ({ ...task, callChelseaNote: event.target.value }))
                            }
                            value={selectedTask.callChelseaNote ?? ""}
                          />
                        </label>
                        <div className="grid gap-2 text-sm font-bold">
                          Task detail editor
                          <RichTextEditor
                            onChange={(html) =>
                              updateSelectedTask((task) => ({
                                ...task,
                                richContent: makeRichContentFromText(html)
                              }))
                            }
                            value={selectedTask.richContent.html}
                          />
                        </div>
                      </div>

                      <div className="detail-panel mt-4 rounded-lg border border-line p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Client dropdown preview
                        </div>
                        <RichContent html={selectedTask.richContent.html} />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-line p-4 text-sm text-ink/62">
                      Select or add a task to edit checklist-row content.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
            </>
          ) : null}

          {activeSection === "Vendors" ? <VendorLibraryManager initialVendors={vendors} /> : null}

          {activeSection === "Clients" ? <ClientManager initialClients={clients} templates={templates} /> : null}

          {activeSection === "Settings" ? <SettingsPanel /> : null}
        </section>
      </div>
    </main>
  );
}

type SettingsState = {
  name: string;
  email: string;
  phone: string;
  business: string;
};

const SETTINGS_KEY = "chelsea-settings";

function loadSettings(): SettingsState {
  if (typeof window === "undefined") {
    return { name: "", email: "", phone: "", business: "" };
  }
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? (JSON.parse(saved) as SettingsState) : { name: "", email: "", phone: "", business: "" };
  } catch {
    return { name: "", email: "", phone: "", business: "" };
  }
}

function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());
  const [saved, setSaved] = useState(false);

  function update(key: keyof SettingsState, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch {}
  }

  const fields: { key: keyof SettingsState; label: string; hint: string; envVar: string; type?: string }[] = [
    { key: "name", label: "Your name", hint: "Used in client-facing greetings and the sticky agreement bar.", envVar: "NEXT_PUBLIC_CHELSEA_NAME" },
    { key: "email", label: "Your email", hint: "Powers the 'Ask Chelsea' button on client checklists.", envVar: "NEXT_PUBLIC_CHELSEA_EMAIL", type: "email" },
    { key: "phone", label: "Your phone", hint: "Reserved for future use (e.g. SMS/call links on mobile).", envVar: "NEXT_PUBLIC_CHELSEA_PHONE", type: "tel" },
    { key: "business", label: "Business name", hint: "Shown in the client checklist header.", envVar: "NEXT_PUBLIC_CHELSEA_BUSINESS" }
  ];

  return (
    <section className="grid gap-5">
      <header className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-accent">Settings</p>
        <h1 className="mt-1 text-3xl font-semibold">Workspace settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/68">
          Configure your contact info and branding. Values saved here are stored locally in this browser. For permanent
          production values, set the corresponding environment variables in your{" "}
          <code className="rounded bg-cloud px-1 font-mono text-xs">.env.local</code> file (or Railway dashboard).
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-sm font-bold uppercase text-ink/58">Agent profile</h2>
          <div className="mt-4 grid gap-4">
            {fields.map((field) => (
              <label key={field.key} className="grid gap-2 text-sm font-bold">
                {field.label}
                <input
                  className="rounded-md border border-line px-3 py-2 text-sm font-normal outline-none focus:border-accent"
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={`Set via ${field.envVar}`}
                  type={field.type ?? "text"}
                  value={settings[field.key]}
                />
                <span className="text-xs font-normal text-ink/55">{field.hint}</span>
              </label>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-md border border-accent bg-white px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft"
            >
              <Save className="h-4 w-4" />
              Save locally
            </button>
            {saved ? <span className="text-sm font-semibold text-success">Saved to this browser</span> : null}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-sm font-bold uppercase text-ink/58">Permanent config</h2>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            To make settings permanent across browsers and deploys, add these to your{" "}
            <code className="rounded bg-cloud px-1 font-mono text-xs">.env.local</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-4 text-xs leading-6 text-white/80">
            {fields.map((field) => `NEXT_PUBLIC_${field.envVar.replace("NEXT_PUBLIC_", "")}="your value"\n`).join("")}
          </pre>
          <p className="mt-3 text-xs text-ink/55">
            On Railway: set these as environment variables in your service dashboard, then redeploy.
          </p>
        </section>
      </div>
    </section>
  );
}
