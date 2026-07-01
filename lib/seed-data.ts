import type { ClientChecklist, MasterTemplate, TemplateSummary, Vendor } from "@/lib/types";

const rich = (html: string) => ({
  json: {
    type: "doc",
    content: []
  },
  html
});

export const vendors: Vendor[] = [
  {
    id: "vendor-spokane-home-loans",
    name: "Spokane Home Loans",
    category: "Lender",
    contactName: "Mia Reynolds",
    phone: "509-555-0182",
    email: "hello@spokanehomeloans.example",
    website: "https://www.spokanehomeloans.example",
    clientFacingNote: "Good for first-time buyers who need calm coaching around payment and timing.",
    serviceArea: "Spokane and surrounding counties",
    isActive: true,
    siteDomain: "spokanehomeloans.example"
  },
  {
    id: "vendor-home-insight",
    name: "Home Insight Inspection",
    category: "Inspector",
    contactName: "Daniel Price",
    phone: "509-555-0144",
    email: "schedule@homeinsight.example",
    website: "https://www.homeinsight.example",
    clientFacingNote: "Thorough reports, sewer scope coordination, and clear explanations after the walkthrough.",
    serviceArea: "Eastern Washington",
    isActive: true,
    siteDomain: "homeinsight.example"
  },
  {
    id: "vendor-title-northwest",
    name: "Title Northwest",
    category: "Title and escrow",
    contactName: "Avery Stone",
    phone: "509-555-0198",
    email: "team@titlenorthwest.example",
    website: "https://www.titlenorthwest.example",
    clientFacingNote: "Responsive closing coordination and helpful reminders when signatures are due.",
    serviceArea: "Washington",
    isActive: true,
    siteDomain: "titlenorthwest.example"
  }
];

export const clientChecklists: ClientChecklist[] = [
  {
    id: "checklist-demo-buyer",
    privateLinkToken: "demo-buyer",
    clientName: "Alex and Jordan",
    clientEmail: "alex-jordan@example.com",
    journeyType: "buyer",
    status: "active",
    stages: [
      {
        id: "buyer-getting-ready",
        title: "Getting Ready",
        shortDescription: "Start with readiness before serious shopping.",
        isCurrent: true,
        sortOrder: 1,
        vendorRecommendations: [],
        richContent: rich(
          `<h3>This stage is about getting clear before we start chasing houses.</h3><p>You do not need to know everything yet. We are looking at your timeline, financing, comfortable payment, and what kind of home would actually fit your life.</p><div class="callout"><strong>Chelsea is watching for:</strong> readiness, financing clarity, and whether expectations match the market.</div><div class="video-embed">Intro video placeholder</div>`
        ),
        tasks: [
          {
            id: "buyer-lender",
            title: "Talk with a lender",
            helperText: "Confirm pre-approval and comfortable monthly payment.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [
              {
                id: "rec-buyer-lender",
                vendorId: "vendor-spokane-home-loans",
                note: "Chelsea recommends starting here if you want patient payment coaching.",
                recommendationType: "recommended",
                sortOrder: 1
              }
            ],
            callChelseaNote:
              "If the payment, cash needed, or timeline feels different than expected, call Chelsea before you adjust your search.",
            richContent: rich(
              `<p>Before we start seriously shopping, we need to understand what you can buy and what payment feels comfortable. A pre-approval helps us move quickly when the right house comes up and prevents heartbreak later.</p><div class="callout"><strong>Why this matters:</strong> The goal is not just getting approved. The goal is succeeding after closing.</div><ul><li>Ask about monthly payment, not just max approval.</li><li>Confirm loan type and estimated cash to close.</li><li>Send Chelsea the pre-approval when ready.</li></ul>`
            )
          },
          {
            id: "buyer-must-haves",
            title: "Share your must-haves",
            helperText: "Your list can change as we tour.",
            isRequired: true,
            isComplete: true,
            sortOrder: 2,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Most buyers discover their real priorities as they tour homes. It is okay if the list changes. We will separate what looks good online from what matters in real life.</p><ol><li>Send your must-haves.</li><li>Send your nice-to-haves.</li><li>Tell Chelsea what would make a home a clear no.</li></ol>`
            )
          },
          {
            id: "buyer-agreement",
            title: "Sign buyer agreement",
            helperText: "Clarifies Chelsea's role representing you.",
            isRequired: true,
            isComplete: false,
            sortOrder: 3,
            vendorRecommendations: [],
            richContent: rich(
              `<p>This formalizes the working relationship and clarifies that Chelsea is representing your interests throughout the search, offer, and closing process.</p>`
            )
          }
        ]
      },
      {
        id: "buyer-house-hunting",
        title: "House Hunting",
        shortDescription: "Tour homes and refine what matters.",
        isCurrent: false,
        sortOrder: 2,
        vendorRecommendations: [],
        richContent: rich(
          `<p>As you tour, Chelsea is watching layout, resale potential, expensive systems, and tradeoffs that are hard to see online.</p>`
        ),
        tasks: [
          {
            id: "buyer-listings",
            title: "Review listing matches",
            helperText: "Chelsea's search can be more precise than public sites.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Chelsea can filter for details public sites often miss, including layout, yard, loan type, and property history.</p>`
            )
          },
          {
            id: "buyer-tour",
            title: "Tour selected homes",
            helperText: "Focus on feel while Chelsea watches risk.",
            isRequired: true,
            isComplete: false,
            sortOrder: 2,
            vendorRecommendations: [],
            richContent: rich(
              `<p>You can focus on how the home feels. Chelsea will look at big-ticket items, location, layout, and future resale considerations.</p>`
            )
          }
        ]
      },
      {
        id: "buyer-under-contract",
        title: "Under Contract",
        shortDescription: "Due diligence, inspection, title, and financing.",
        isCurrent: false,
        sortOrder: 3,
        vendorRecommendations: [
          {
            id: "rec-stage-title",
            vendorId: "vendor-title-northwest",
            note: "Chelsea will coordinate title and escrow, but this is the team you may hear from.",
            recommendationType: "optional",
            sortOrder: 1
          }
        ],
        richContent: rich(
          `<p>This stage is where deadlines matter. Chelsea is tracking inspection, lender, title, and closing steps so you do not have to hold every detail in your head.</p>`
        ),
        tasks: [
          {
            id: "buyer-inspection",
            title: "Schedule inspection",
            helperText: "One of your strongest buyer protections.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [
              {
                id: "rec-buyer-inspection",
                vendorId: "vendor-home-insight",
                note: "Strong option when you want clear explanations and a careful report.",
                recommendationType: "recommended",
                sortOrder: 1
              }
            ],
            richContent: rich(
              `<p>The inspection is not just a checkbox. It helps you understand the home, decide what matters, and protect your options before deadlines pass.</p>`
            )
          },
          {
            id: "buyer-report",
            title: "Review inspection report",
            helperText: "Long reports are normal.",
            isRequired: true,
            isComplete: false,
            sortOrder: 2,
            vendorRecommendations: [],
            callChelseaNote:
              "Call Chelsea before you decide whether a finding is a dealbreaker or a normal maintenance item.",
            richContent: rich(
              `<p>An inspection report is information, not a repair list. We will separate maintenance from major concerns and decide what to request.</p>`
            )
          }
        ]
      }
    ]
  },
  {
    id: "checklist-demo-seller",
    privateLinkToken: "demo-seller",
    clientName: "Morgan Lee",
    clientEmail: "morgan@example.com",
    journeyType: "seller",
    status: "active",
    stages: [
      {
        id: "seller-prep",
        title: "Prep the Property",
        shortDescription: "Choose the work that helps the sale without overdoing it.",
        isCurrent: true,
        sortOrder: 1,
        vendorRecommendations: [],
        richContent: rich(
          `<p>This is where we make the home easier for buyers to understand. Chelsea will help separate useful prep from projects that are unlikely to pay off.</p>`
        ),
        tasks: [
          {
            id: "seller-walkthrough",
            title: "Complete prep walkthrough",
            helperText: "Chelsea will identify the few changes that matter most.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Walk room by room with Chelsea and make a short, practical prep list. The goal is clarity, not perfection.</p>`
            )
          },
          {
            id: "seller-documents",
            title: "Gather home documents",
            helperText: "Receipts, warranties, HOA details, and utility averages help.",
            isRequired: false,
            isComplete: false,
            sortOrder: 2,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Useful documents can answer buyer questions quickly and make the home feel well cared for.</p>`
            )
          }
        ]
      },
      {
        id: "seller-launch",
        title: "Launch Listing",
        shortDescription: "Photos, pricing, showings, and first-week feedback.",
        isCurrent: false,
        sortOrder: 2,
        vendorRecommendations: [],
        richContent: rich(
          `<p>The first week matters. Chelsea will watch showing activity, buyer feedback, and whether the pricing story is landing.</p>`
        ),
        tasks: [
          {
            id: "seller-photos",
            title: "Prepare for photos",
            helperText: "Small styling choices make listing photos easier to read.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Clear counters, open blinds, and simple surfaces help buyers understand the space online.</p>`
            )
          }
        ]
      }
    ]
  },
  {
    id: "checklist-demo-buyer-seller",
    privateLinkToken: "demo-buyer-seller",
    clientName: "Taylor and Sam",
    clientEmail: "taylor-sam@example.com",
    journeyType: "buyer_seller",
    status: "active",
    stages: [
      {
        id: "dual-buyer-plan",
        journeyTrack: "buyer",
        title: "Buying Plan",
        shortDescription: "Clarify payment, offer strategy, and timing for the next home.",
        isCurrent: true,
        sortOrder: 1,
        vendorRecommendations: [],
        richContent: rich(
          `<p>This side of the checklist focuses on the next home. Chelsea is watching payment comfort, offer strength, sale-contingency strategy, inspection windows, and possession timing.</p><div class="callout"><strong>Buyer-side focus:</strong> Can we make a confident offer without losing sight of what has to happen on the sale?</div>`
        ),
        tasks: [
          {
            id: "dual-net-and-payment",
            title: "Confirm buying payment range",
            helperText: "Chelsea will connect the sale math to the next purchase.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [
              {
                id: "rec-dual-lender",
                vendorId: "vendor-spokane-home-loans",
                note: "Helpful when sale proceeds affect down payment, timing, or bridge options.",
                recommendationType: "recommended",
                sortOrder: 1
              }
            ],
            callChelseaNote:
              "Call Chelsea before you make assumptions about closing dates, possession, or using proceeds from the sale.",
            richContent: rich(
              `<p>This step keeps the purchase grounded in real numbers. The goal is to understand what you can comfortably buy next and what timing constraints we need to protect.</p><ul><li>Confirm payment comfort.</li><li>Review down payment assumptions.</li><li>Discuss whether the purchase depends on the sale closing first.</li></ul>`
            )
          },
          {
            id: "dual-priority-map",
            title: "Choose offer strategy",
            helperText: "Decide how aggressive or protected the purchase should be.",
            isRequired: true,
            isComplete: false,
            sortOrder: 2,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Some clients need a sale contingency. Others can make the purchase stronger with different timing, financing, or possession terms. Chelsea will help you understand the tradeoffs before the market forces a rushed decision.</p>`
            )
          }
        ]
      },
      {
        id: "dual-buyer-search",
        journeyTrack: "buyer",
        title: "Search for the Next Home",
        shortDescription: "Tour homes while keeping sale timing and offer terms visible.",
        isCurrent: false,
        sortOrder: 2,
        vendorRecommendations: [],
        richContent: rich(
          `<p>This stage uses Chelsea's buyer process, with extra attention on offer terms that interact with your sale.</p>`
        ),
        tasks: [
          {
            id: "dual-tour",
            title: "Tour next-home candidates",
            helperText: "Watch fit, timing, and offer feasibility together.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [],
            richContent: rich(
              `<p>As you tour, Chelsea will help compare the home itself with the timing reality of selling your current home.</p>`
            )
          }
        ]
      },
      {
        id: "dual-seller-prep",
        journeyTrack: "seller",
        title: "Prepare the Sale",
        shortDescription: "Get the current home ready without over-improving.",
        isCurrent: false,
        sortOrder: 1,
        vendorRecommendations: [],
        richContent: rich(
          `<p>This side of the checklist focuses on selling the current home. Chelsea is watching prep, pricing, launch timing, buyer feedback, and how the sale timeline affects the purchase.</p><div class="callout"><strong>Seller-side focus:</strong> What needs to happen to create a strong sale without slowing down the next move?</div>`
        ),
        tasks: [
          {
            id: "dual-home-prep",
            title: "Finish listing prep list",
            helperText: "Only do the work that supports the next move.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Chelsea will help decide which prep items are worth doing and which would distract from the bigger timeline.</p>`
            )
          },
          {
            id: "dual-sale-documents",
            title: "Gather seller documents",
            helperText: "Receipts, warranties, HOA details, and utility averages help.",
            isRequired: false,
            isComplete: false,
            sortOrder: 2,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Useful documents can answer buyer questions quickly and make the home feel well cared for.</p>`
            )
          }
        ]
      },
      {
        id: "dual-seller-launch",
        journeyTrack: "seller",
        title: "Launch Listing",
        shortDescription: "Photos, pricing, showings, and first-week feedback.",
        isCurrent: false,
        sortOrder: 2,
        vendorRecommendations: [],
        richContent: rich(
          `<p>The first week matters. Chelsea will watch showing activity, buyer feedback, and whether the pricing story is landing.</p>`
        ),
        tasks: [
          {
            id: "dual-photos",
            title: "Prepare for photos",
            helperText: "Small styling choices make listing photos easier to read.",
            isRequired: true,
            isComplete: false,
            sortOrder: 1,
            vendorRecommendations: [],
            richContent: rich(
              `<p>Clear counters, open blinds, and simple surfaces help buyers understand the space online.</p>`
            )
          }
        ]
      }
    ]
  }
];

function templateStagesFromDemo(token: string) {
  const checklist = clientChecklists.find((item) => item.privateLinkToken === token);

  if (!checklist) {
    return [];
  }

  return checklist.stages.map((stage) => ({
    ...stage,
    isCurrent: false,
    tasks: stage.tasks.map((task) => ({
      ...task,
      isComplete: false
    }))
  }));
}

export const masterTemplates: MasterTemplate[] = [
  {
    id: "template-buyer-default",
    name: "Buyer master template",
    journeyType: "buyer",
    version: 1,
    stages: templateStagesFromDemo("demo-buyer")
  },
  {
    id: "template-seller-default",
    name: "Seller master template",
    journeyType: "seller",
    version: 1,
    stages: templateStagesFromDemo("demo-seller")
  }
];

export const templateSummaries: TemplateSummary[] = masterTemplates.map((template) => ({
  id: template.id,
  name: template.name,
  journeyType: template.journeyType,
  stageCount: template.stages.length,
  taskCount: template.stages.reduce((count, stage) => count + stage.tasks.length, 0)
}));
