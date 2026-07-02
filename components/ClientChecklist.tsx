"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Check,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Home,
  Lock,
  MessageCircle,
  Phone,
  UserRound
} from "lucide-react";
import { getJourneyLabel, getProgress, resolveRecommendations } from "@/lib/checklist";
import { CHELSEA_EMAIL, CHELSEA_NAME } from "@/lib/config";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openTasks, setOpenTasks] = useState<Record<string, boolean>>(() => {
    const firstTask = checklist.stages.flatMap((stage) => stage.tasks)[0];
    return firstTask ? { [firstTask.id]: true } : {};
  });
  const storageKey = `checklist-progress-${checklist.privateLinkToken}`;
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const base = Object.fromEntries(
      checklist.stages.flatMap((stage) => stage.tasks).map((task) => [task.id, task.isComplete])
    );

    if (typeof window === "undefined") {
      return base;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...base, ...(JSON.parse(saved) as Record<string, boolean>) } : base;
    } catch {
      return base;
    }
  });

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
  const allDone = progress.percent === 100 && progress.total > 0;

  const isBuyerJourney = checklist.journeyType === "buyer" || checklist.journeyType === "buyer_seller";

  const needsAgreement =
    !checklist.agreementSigned &&
    checklist.stages.some((stage) => stage.tasks.some((task) => task.taskRole === "sign_agreement"));

  return (
    <main className={clsx("min-h-screen bg-cloud px-4 py-5 text-ink sm:px-6 lg:px-8", needsAgreement && "pb-28")}>
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

          {allDone ? (
            <div className="mt-5 flex items-center gap-4 rounded-lg border border-success/40 bg-successSoft px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white">
                <Check className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-success">You&apos;re all done, {checklist.clientName.split(" ")[0]}!</p>
                <p className="mt-0.5 text-sm text-success/80">
                  Every step is complete. {CHELSEA_NAME} will be in touch to confirm your next milestone.
                </p>
              </div>
              {CHELSEA_EMAIL ? (
                <a
                  href={`mailto:${CHELSEA_EMAIL}`}
                  className="hidden shrink-0 items-center gap-2 rounded-md border border-success bg-white px-3 py-2 text-sm font-bold text-success hover:bg-successSoft sm:inline-flex"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message {CHELSEA_NAME}
                </a>
              ) : null}
            </div>
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink/70">Current stage: {currentStage?.title}</p>
                  <p className="text-sm font-bold text-ink">
                    {progress.complete} of {progress.total} complete
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                </div>
              </div>
              {CHELSEA_EMAIL ? (
                <a
                  href={`mailto:${CHELSEA_EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-accent bg-white px-4 py-2 text-sm font-bold text-accent hover:bg-accentSoft"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask {CHELSEA_NAME}
                </a>
              ) : null}
            </div>
          )}
        </header>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside>
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold shadow-soft lg:hidden"
            >
              <span className="flex items-center gap-2 text-ink/72">
                <ClipboardList className="h-4 w-4" />
                {selectedStage?.title ?? "Stages"}
              </span>
              <ChevronRight className={clsx("h-4 w-4 text-ink/50 transition", mobileNavOpen && "rotate-90")} />
            </button>

            <div className={clsx("mt-2 rounded-lg border border-line bg-white p-3 shadow-soft lg:mt-0 lg:block", !mobileNavOpen && "hidden")}>
              <nav className="grid gap-1">
                {visibleStages.map((stage, visibleIndex) => {
                  const taskCount = stage.tasks.length;
                  const completeCount = stage.tasks.filter((task) => checkedTasks[task.id]).length;
                  const allDone = taskCount > 0 && completeCount === taskCount;

                  return (
                    <Fragment key={stage.id}>
                      {visibleIndex === 0 ? (
                        <p className="flex items-center gap-1.5 px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-ink/45">
                          <ClipboardList className="h-3 w-3" />
                          Get started
                        </p>
                      ) : visibleIndex === 1 ? (
                        <p className="flex items-center gap-1.5 px-2 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-ink/45">
                          <ClipboardList className="h-3 w-3" />
                          Stages
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStageId(stage.id);
                          setOpenStage(false);
                          setMobileNavOpen(false);
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
                            allDone
                              ? "bg-success text-white"
                              : selectedStageId === stage.id || stage.isCurrent
                                ? "border border-accent bg-white text-accent"
                                : "bg-cloud text-ink/70"
                          )}
                        >
                          {allDone ? <Check className="h-4 w-4" /> : visibleIndex + 1}
                        </span>
                        <span>
                          <span className="block text-sm font-bold">{stage.title}</span>
                          <span className="mt-1 block text-xs text-ink/62">
                            {completeCount} of {taskCount} tasks
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  );
                })}
              </nav>
            </div>
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
              {(() => {
                const stageTasks = selectedStage.tasks;
                const stageComplete = stageTasks.length > 0 && stageTasks.every((t) => checkedTasks[t.id]);

                return (
                  <>
                    {stageComplete ? (
                      <div className="flex items-center gap-3 rounded-lg border border-success/40 bg-successSoft px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-white">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-success">Stage complete</p>
                          <p className="text-xs text-success/80">All tasks in this stage are done.</p>
                        </div>
                        {(() => {
                          const idx = visibleStages.findIndex((s) => s.id === selectedStage.id);
                          const next = visibleStages[idx + 1];
                          return next && !allDone ? (
                            <button
                              type="button"
                              onClick={() => { setSelectedStageId(next.id); setOpenStage(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-success bg-white px-3 py-1.5 text-xs font-bold text-success hover:bg-successSoft"
                            >
                              Next stage
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          ) : null;
                        })()}
                      </div>
                    ) : null}
                    {stageTasks.map((task) => {
                const isOpen = Boolean(openTasks[task.id]);
                const isChecked = Boolean(checkedTasks[task.id]);
                const recommendations = resolveRecommendations(task.vendorRecommendations);

                return (
                  <article key={task.id} className="overflow-hidden rounded-lg border border-line bg-white">
                    <div className="grid grid-cols-[44px_1fr] items-stretch">
                      <button
                        type="button"
                        aria-label={isChecked ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                        onClick={() =>
                          setCheckedTasks((value) => {
                            const next = { ...value, [task.id]: !isChecked };
                            try {
                              localStorage.setItem(storageKey, JSON.stringify(next));
                            } catch {}
                            fetch("/api/progress", {
                              method: "POST",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({
                                token: checklist.privateLinkToken,
                                taskId: task.id,
                                isComplete: !isChecked
                              })
                            }).catch(() => {});
                            return next;
                          })
                        }
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
                          <span className="flex flex-wrap items-center gap-2">
                            <span className={clsx("text-sm font-bold", isChecked && "text-ink/50 line-through")}>
                              {task.title}
                            </span>
                            {!task.isRequired ? (
                              <span className="rounded-full border border-line bg-cloud px-2 py-0.5 text-[10px] font-bold uppercase text-ink/50">
                                Optional
                              </span>
                            ) : null}
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
                        {task.taskRole === "sign_agreement" ? (
                          <div className="mt-4 rounded-lg border border-accent/30 bg-accentSoft p-4">
                            <p className="text-sm font-bold text-accent">Ready to sign?</p>
                            {checklist.agreementLink ? (
                              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <a
                                  href={checklist.agreementLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-md border border-accent bg-white px-4 py-2 text-sm font-bold text-accent hover:bg-white/80"
                                >
                                  {isBuyerJourney
                                    ? `Sign with ${CHELSEA_NAME} via Authentisign`
                                    : `Sign the listing agreement via Authentisign`}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                                <span className="text-xs text-ink/60">Takes about two minutes</span>
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-ink/72">
                                {CHELSEA_NAME} will send the agreement to your email via Authentisign. Check your inbox — it takes about two minutes to complete.
                              </p>
                            )}
                          </div>
                        ) : null}
                        {task.callChelseaNote ? (
                          <div className="mt-4 flex gap-3 rounded-lg border border-accent/30 bg-accentSoft p-3">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-white text-accent">
                              <Phone className="h-3.5 w-3.5" />
                            </div>
                            <div className="text-sm leading-6">
                              <span className="font-bold text-accent">Call Chelsea: </span>
                              <span className="text-ink/78">{task.callChelseaNote}</span>
                            </div>
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
                  </>
                );
              })()}
            </div>
          </section>
        </div>
      </div>

      {needsAgreement ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-accent/20 bg-ink px-4 py-3 shadow-lg sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
                {CHELSEA_NAME[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {isBuyerJourney
                    ? `One step before ${CHELSEA_NAME} can show you homes`
                    : `One step before ${CHELSEA_NAME} can list your home`}
                </p>
                <p className="text-xs text-white/62">
                  {isBuyerJourney
                    ? "Washington law requires a signed Buyer Brokerage Services Agreement. Stage 1 explains why."
                    : `${CHELSEA_NAME} needs a signed Listing Agreement before your home goes on the market. Stage 1 covers the details.`}
                </p>
              </div>
            </div>
            {checklist.agreementLink ? (
              <a
                href={checklist.agreementLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent/90"
              >
                {isBuyerJourney ? "Sign the buyer agreement" : "Sign the listing agreement"}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <div className="shrink-0 rounded-md border border-white/20 px-4 py-2.5 text-center text-xs font-semibold text-white/70">
                {CHELSEA_NAME} will send the Authentisign link to your email
              </div>
            )}
          </div>
        </div>
      ) : null}
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
