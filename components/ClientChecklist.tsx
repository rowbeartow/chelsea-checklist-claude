"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Check,
  ChevronRight,
  ClipboardList,
  Home,
  Lock,
  MessageCircle,
  UserRound
} from "lucide-react";
import { getJourneyLabel, getProgress, resolveRecommendations } from "@/lib/checklist";
import type { ClientChecklist as ClientChecklistType } from "@/lib/types";
import type { TemplateJourneyType } from "@/lib/types";
import { RichContent } from "@/components/RichContent";
import { VendorCard } from "@/components/VendorCard";

type ClientChecklistProps = {
  checklist: ClientChecklistType;
};

export function ClientChecklist({ checklist }: ClientChecklistProps) {
  const hasJourneyToggle = checklist.journeyType === "buyer_seller";
  const initialJourneyTrack =
    checklist.stages.find((stage) => stage.isCurrent)?.journeyTrack ??
    checklist.stages.find((stage) => stage.journeyTrack)?.journeyTrack ??
    "buyer";
  const [selectedJourneyTrack, setSelectedJourneyTrack] = useState<TemplateJourneyType>(initialJourneyTrack);
  const visibleStages = useMemo(
    () =>
      hasJourneyToggle
        ? checklist.stages.filter((stage) => stage.journeyTrack === selectedJourneyTrack)
        : checklist.stages,
    [checklist.stages, hasJourneyToggle, selectedJourneyTrack]
  );
  const initialStageId = visibleStages.find((stage) => stage.isCurrent)?.id ?? visibleStages[0]?.id ?? checklist.stages[0]?.id;
  const [selectedStageId, setSelectedStageId] = useState(initialStageId);
  const [openStage, setOpenStage] = useState(false);
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>(() => {
    const firstTask = checklist.stages.flatMap((stage) => stage.tasks)[0];
    return firstTask ? { [firstTask.id]: true } : {};
  });
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(checklist.stages.flatMap((stage) => stage.tasks).map((task) => [task.id, task.isComplete]))
  );

  useEffect(() => {
    if (visibleStages.some((stage) => stage.id === selectedStageId)) {
      return;
    }

    setSelectedStageId(visibleStages.find((stage) => stage.isCurrent)?.id ?? visibleStages[0]?.id ?? checklist.stages[0]?.id);
    setOpenStage(false);
  }, [checklist.stages, selectedStageId, visibleStages]);

  const selectedStage = visibleStages.find((stage) => stage.id === selectedStageId) ?? visibleStages[0] ?? checklist.stages[0];

  const progress = useMemo(() => {
    const hydratedChecklist = {
      ...checklist,
      stages: visibleStages.map((stage) => ({
        ...stage,
        tasks: stage.tasks.map((task) => ({
          ...task,
          isComplete: checkedTasks[task.id] ?? task.isComplete
        }))
      }))
    };

    return getProgress(hydratedChecklist);
  }, [checklist, checkedTasks, visibleStages]);

  const currentStage = visibleStages.find((stage) => stage.isCurrent) ?? visibleStages[0] ?? checklist.stages[0];

  return (
    <main className="min-h-screen bg-cloud px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-lg font-bold text-white">
                C
              </div>
              <div>
                <p className="text-sm font-semibold text-ink/62">Chelsea Real Estate</p>
                <h1 className="text-2xl font-semibold sm:text-3xl">{checklist.clientName}</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-line bg-cloud px-3 py-2 text-sm font-semibold capitalize">
                <Home className="h-4 w-4 text-accent" />
                {getJourneyLabel(checklist.journeyType)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-line bg-cloud px-3 py-2 text-sm font-semibold">
                <Lock className="h-4 w-4 text-ink/50" />
                Private link
              </span>
            </div>
          </div>

          {hasJourneyToggle ? (
            <div className="mt-5 rounded-lg border border-line bg-cloud p-1">
              <div className="grid grid-cols-2 gap-1">
                {[
                  { value: "buyer" as const, label: "Buying", description: "Next home" },
                  { value: "seller" as const, label: "Selling", description: "Current home" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedJourneyTrack(option.value)}
                    className={clsx(
                      "rounded-md px-3 py-2 text-left transition",
                      selectedJourneyTrack === option.value
                        ? "border border-accent bg-white text-accent shadow-sm"
                        : "border border-transparent hover:bg-white"
                    )}
                  >
                    <span className="block text-sm font-bold">{option.label}</span>
                    <span
                      className={clsx(
                        "mt-0.5 block text-xs",
                        selectedJourneyTrack === option.value ? "text-accent/75" : "text-ink/62"
                      )}
                    >
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink/70">Current stage: {currentStage?.title}</p>
                <p className="text-sm font-bold text-ink">
                  {progress.complete} of {progress.total} complete
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-success" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
            <a
              href="mailto:chelsea@example.com"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-accent bg-white px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Chelsea
            </a>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-lg border border-line bg-white p-3 shadow-soft">
            <div className="mb-3 flex items-center gap-2 px-2 pt-1 text-sm font-bold text-ink/72">
              <ClipboardList className="h-4 w-4" />
              Stages
            </div>
            <nav className="grid gap-2">
              {visibleStages.map((stage) => {
                const visibleIndex = visibleStages.findIndex((visibleStage) => visibleStage.id === stage.id);
                const taskCount = stage.tasks.length;
                const completeCount = stage.tasks.filter((task) => checkedTasks[task.id]).length;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setSelectedStageId(stage.id);
                      setOpenStage(false);
                    }}
                    className={clsx(
                      "grid grid-cols-[28px_1fr] gap-3 rounded-md border px-3 py-3 text-left transition",
                      selectedStageId === stage.id
                        ? "border-accent bg-white shadow-sm"
                        : "border-transparent hover:border-line hover:bg-cloud"
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold",
                        selectedStageId === stage.id
                          ? "border border-accent bg-white text-accent"
                          : stage.isCurrent
                            ? "border border-accent bg-white text-accent"
                            : "bg-cloud text-ink/70"
                      )}
                    >
                      {visibleIndex + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{stage.title}</span>
                      <span className="mt-1 block text-xs text-ink/62">
                        {completeCount} of {taskCount} tasks
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-accent">
                  {selectedStage.isCurrent ? "Current stage" : "Upcoming stage"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">{selectedStage.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/68">{selectedStage.shortDescription}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenStage((value) => !value)}
                className="inline-flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-sm font-bold text-ink hover:border-ink"
              >
                Stage details
                <ChevronRight className={clsx("h-4 w-4 transition", openStage && "rotate-90")} />
              </button>
            </div>

            {openStage ? (
              <div className="detail-panel mt-4 rounded-lg border border-line p-4">
                <RichContent html={selectedStage.richContent.html} />
                {resolveRecommendations(selectedStage.vendorRecommendations).length ? (
                  <VendorSection recommendations={selectedStage.vendorRecommendations} title="Recommended for this stage" />
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {selectedStage.tasks.map((task) => {
                const isOpen = Boolean(openTasks[task.id]);
                const isChecked = Boolean(checkedTasks[task.id]);
                const recommendations = resolveRecommendations(task.vendorRecommendations);

                return (
                  <article key={task.id} className="overflow-hidden rounded-lg border border-line bg-white">
                    <div className="grid grid-cols-[44px_1fr] items-stretch">
                      <button
                        type="button"
                        aria-label={isChecked ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                        onClick={() => setCheckedTasks((value) => ({ ...value, [task.id]: !isChecked }))}
                        className={clsx(
                          "flex items-center justify-center border-r border-line transition",
                          isChecked ? "bg-success text-white" : "bg-cloud text-ink/40 hover:text-ink"
                        )}
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenTasks((value) => ({ ...value, [task.id]: !isOpen }))}
                        className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-3 text-left hover:bg-cloud sm:px-4"
                      >
                        <span>
                          <span className={clsx("block text-sm font-bold", isChecked && "text-ink/50 line-through")}>
                            {task.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-ink/62">{task.helperText}</span>
                        </span>
                        <span className="rounded-md border border-accent/35 bg-white px-2 py-1 text-xs font-bold uppercase text-accent">
                          Details
                        </span>
                        <ChevronRight className={clsx("h-5 w-5 text-ink/50 transition", isOpen && "rotate-90")} />
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="detail-panel border-t border-line px-4 py-4 sm:pl-[60px]">
                        <RichContent html={task.richContent.html} />
                        {task.callChelseaNote ? (
                          <div className="mt-4 rounded-lg border border-line bg-white p-3 text-sm leading-6 text-ink/72">
                            <strong className="text-ink">When to call Chelsea: </strong>
                            {task.callChelseaNote}
                          </div>
                        ) : null}
                        {recommendations.length ? (
                          <VendorSection recommendations={task.vendorRecommendations} title="Chelsea recommends" />
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function VendorSection({
  recommendations,
  title
}: {
  recommendations: ClientChecklistType["stages"][number]["vendorRecommendations"];
  title: string;
}) {
  const resolved = resolveRecommendations(recommendations);

  if (!resolved.length) {
    return null;
  }

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
        <UserRound className="h-4 w-4 text-accent" />
        {title}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {resolved.map(({ recommendation, vendor }) => (
          <VendorCard key={recommendation.id} recommendation={recommendation} vendor={vendor} />
        ))}
      </div>
    </section>
  );
}
