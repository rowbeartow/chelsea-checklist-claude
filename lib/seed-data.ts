import type { ClientChecklist, MasterTemplate, Vendor } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rich = (html: string) => ({
  json: { type: "doc", content: [] } as Record<string, unknown>,
  html
});

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------

export const vendors: Vendor[] = [
  {
    id: "vendor-spokane-home-loans",
    name: "Spokane Home Loans",
    category: "Lender",
    contactName: "Mia Reynolds",
    phone: "509-555-0182",
    email: "hello@spokanehomeloans.example",
    website: "https://www.spokanehomeloans.example",
    clientFacingNote:
      "Good for first-time buyers who need calm coaching around payment and timing. They explain the numbers — not just approve them.",
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
    clientFacingNote:
      "Thorough reports, sewer scope coordination, FLIR cameras, and clear walk-through explanations. They help you understand the home, not just document it.",
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
    clientFacingNote:
      "Responsive closing coordination and helpful reminders when signatures are due. Good at keeping things on track when timelines are tight.",
    serviceArea: "Washington",
    isActive: true,
    siteDomain: "titlenorthwest.example"
  },
  {
    id: "vendor-spokane-movers",
    name: "Spokane Moving Co.",
    category: "Movers",
    contactName: "Luis Vargas",
    phone: "509-555-0221",
    email: "book@spokanemoving.example",
    website: "https://www.spokanemoving.example",
    clientFacingNote: "Books up fast around end-of-month closings. Call early.",
    serviceArea: "Spokane metro",
    isActive: true,
    siteDomain: "spokanemoving.example"
  }
];

// ---------------------------------------------------------------------------
// Buyer template stages
// ---------------------------------------------------------------------------

const buyerStages: ClientChecklist["stages"] = [
  {
    id: "tpl-buyer-choosing-agent",
    title: "Choosing your agent",
    shortDescription: "Formalize the relationship before we start touring homes.",
    richContent: rich(
      `<p>Before we start touring homes together, Washington law requires us to sign a written agreement that spells out how I'll represent you and how I'm compensated. This isn't just paperwork — it's a chance for you to understand exactly what to expect from working with me, and for me to explain my process and what you're getting. We'll go through it together, and I'll answer any questions before you sign.</p>`
    ),
    sortOrder: 1,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-ca-1",
        title: "Interview your agent",
        helperText: "Ask about experience, process, and availability.",
        richContent: rich(`<p>Ask specifically how they work, what you'll hear from them during your search, what happens if things don't go as planned, and what you're committing to when you sign the agreement. These are fair questions before any working relationship.</p>`),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-ca-2",
        title: "Review the Buyer Brokerage Services Agreement",
        helperText: "Understand the term, services, and compensation before signing.",
        richContent: rich(`<p>Washington law (RCW 18.86) requires a written buyer brokerage services agreement before an agent can show you homes. The agreement must specifically disclose how your agent is compensated and state that commissions are negotiable and not set by law. We'll go through it together — nothing gets signed without you understanding it.</p>`),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-ca-3",
        title: "Confirm compensation and term in writing",
        helperText: "Exclusive vs. non-exclusive, and for how long.",
        richContent: rich(`<p>Confirm the agreement's term and whether it's exclusive or non-exclusive. If something isn't clear, ask before you sign. This is a business relationship and you're entitled to understand it fully.</p>`),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-ca-4",
        title: "Sign the agreement",
        helperText: "Sent separately for e-signature.",
        richContent: rich(`<p>Once you've reviewed everything and your questions are answered, the agreement is sent separately for e-signature. This is what formally starts our working relationship.</p>`),
        isRequired: true,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-getting-ready",
    title: "Getting ready",
    shortDescription: "Understand your financing and what you're actually looking for before we tour.",
    richContent: rich(
      `<p>I don't start with houses. I start with readiness. Right now I'm trying to understand you, not just your search criteria — your timeline, whether you've talked to a lender yet, what your life actually needs. You may think you know what you want, but often that's really just what looks good online. The real priorities — commute, neighborhood feel, future needs, how much maintenance you want to take on — tend to show up once we start touring. That's expected, and we'll work through it together.</p>`
    ),
    sortOrder: 2,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-gr-1",
        title: "Check your credit report and score",
        helperText: "Know where you stand before talking to a lender.",
        richContent: rich(`<p>Pull your credit report before meeting with a lender so you're not caught off guard. You're entitled to a free report from each bureau annually at annualcreditreport.com. If anything looks wrong, it's better to know early.</p>`),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-gr-2",
        title: "Get pre-approved for a mortgage",
        helperText: "Pre-approval (not just pre-qualification) before we tour seriously.",
        richContent: rich(
          `<p>Before we start seriously shopping, we need to understand what you can buy and what payment actually feels comfortable. A pre-approval helps us move quickly when the right house comes up and prevents heartbreak later. I work with lenders who can hustle without creating stress, who'll coach you on credit, debt, and loan options rather than just running numbers.</p><div class="callout"><strong>The goal is not just getting approved.</strong> The goal is succeeding after closing. We want a payment that works with your real life — including savings, repairs, utilities, insurance, taxes, and future plans.</div>`
        ),
        callChelseaNote:
          "If the payment, cash needed, or timeline feels different than expected, call Chelsea before you adjust your search.",
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: [
          {
            id: "rec-buyer-gr-lender",
            vendorId: "vendor-spokane-home-loans",
            note: "Chelsea recommends starting here for patient coaching around payment and loan options.",
            recommendationType: "recommended",
            sortOrder: 1
          }
        ]
      },
      {
        id: "tpl-buyer-gr-3",
        title: "Determine your real budget",
        helperText: "Payment comfort matters more than maximum approval.",
        richContent: rich(
          `<p>I'd rather you be comfortable than maxed out. A budget conversation isn't just about what the bank will lend — it's about what payment lets you still live your life, build savings, handle repairs, and not feel stressed about the mortgage every month. Paying the mortgage is one of the most important things for protecting your credit and long-term stability.</p><ul><li>Include closing costs (typically 2–5% of purchase price)</li><li>Budget for the move itself</li><li>Keep a reserve for repairs — even move-in ready homes have surprises</li></ul>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-gr-4",
        title: "List your must-haves vs. nice-to-haves",
        helperText: "Your list will evolve as we tour — that's normal.",
        richContent: rich(
          `<p>It's okay if your list changes. Most buyers start with what they think they want and discover what actually matters after seeing homes. We'll keep refining this together — the list you start with rarely matches the house you end up loving, and that's completely normal.</p><p>Focus your must-haves on the things that are expensive or impossible to change: location, lot size, layout, school district. Nice-to-haves are things that matter but could be changed or worked around: finishes, counters, paint colors.</p>`
        ),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-gr-5",
        title: "Choose neighborhoods or areas to target",
        helperText: "Narrow your geographic focus before we start touring.",
        richContent: rich(`<p>If you don't have a strong geographic preference yet, that's fine — we'll explore. If you do, it helps to be intentional about it early so we're not wasting time on homes that won't work for your commute, schools, or lifestyle.</p>`),
        isRequired: false,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-house-hunting",
    title: "House hunting",
    shortDescription: "Tour with clear eyes — I'm watching things you may not be.",
    richContent: rich(
      `<p>I provide more than access to listings. Buyers often focus on what looks cute or emotionally appealing — I'm also looking at whether the home will still be a good decision later. I've had clients fall in love with a charming older home and walk away once we talked through the real ownership burden: an old foundation, a roof on its last legs, tiny rooms, not a great fit for what they actually needed. I've also had a client take on a log cabin on acreage that needed specialized upkeep — I made sure she understood exactly what she was taking on, and she's still happy there years later.</p><p>Either way works. What matters is that you're deciding with clear eyes, not just on what looks good in photos.</p>`
    ),
    sortOrder: 3,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-hh-1",
        title: "Set up a home search",
        helperText: "I can search in ways public sites can't.",
        richContent: rich(
          `<p>I can search in ways public sites often can't. We can filter for the details that actually matter to you — layout, yard, loan type, neighborhood — and other practical factors that may not be obvious online. Sites like Zillow don't have the same depth of search tools, and automated estimates can be wrong: they may not account for improvements, may have incorrect bed/bath/square footage data, or adjust quickly after a listing goes live to match the asking price.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-hh-2",
        title: "Tour homes",
        helperText: "You focus on how the house feels. I'll be looking at what's expensive to change.",
        richContent: rich(
          `<p>As we tour, you can focus on how the house feels. I'll also be looking at resale potential, layout, big-ticket systems (roof, electrical, foundation, plumbing, HVAC, sewer), and location — the things that are expensive or impossible to change later.</p><p>My job isn't to decide for you. It's to make sure you understand the tradeoffs clearly enough to decide confidently.</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-hh-3",
        title: "Research comparable sale prices",
        helperText: "Understand what's actually selling and at what price.",
        richContent: rich(`<p>Before you get attached to a home, it helps to understand whether the price is grounded in reality. I'll pull comparable sales so you know what you're working with before we make any decisions.</p>`),
        isRequired: false,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-hh-4",
        title: "Check schools, commute, and future development",
        helperText: "The things you can't change after you buy.",
        richContent: rich(`<p>Location factors are some of the most important things to research because they can't be changed after you buy. School ratings, commute times, nearby commercial development plans, flood zones, and HOA rules (if any) should all be looked at before you get emotionally invested.</p>`),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-hh-5",
        title: "Narrow to a shortlist",
        helperText: "A house doesn't need to be perfect. It needs to make sense.",
        richContent: rich(
          `<p>A house doesn't need to be perfect. It needs to make sense. We'll talk through what you love, what concerns us, what can be changed, what can't be changed, and whether the tradeoffs fit your life. Once we have a shortlist, we can get more strategic about timing and offers.</p>`
        ),
        isRequired: false,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-making-offer",
    title: "Making an offer",
    shortDescription: "Strategy built from data — not a gut feeling.",
    richContent: rich(
      `<p>I don't use a simple formula for offers. I build strategy from market data, seller motivation, property condition, and your comfort level. There may be a market-supported price, but you also have to be able to sleep at night.</p><p>Buyers often think making an offer is the point of no return — it isn't. It's the beginning of due diligence. The part that actually feels real is later: when you've paid an inspector and turned in your response. That's when it stops being hypothetical. Until then, try not to let the offer stage carry more weight than it needs to.</p>`
    ),
    sortOrder: 4,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-mo-1",
        title: "Review comparable sales with Chelsea",
        helperText: "Understand what the price is actually supported by.",
        richContent: rich(
          `<p>Before we decide what to offer, I'll review comparable sales, listing history, price changes, and market activity so we know what the price is actually supported by — not just a gut feeling. I also often check in with the listing agent to understand what matters most to the seller. Sometimes it's price. Sometimes it's timing, certainty, or just keeping things simple.</p>`
        ),
        callChelseaNote: "Call Chelsea before deciding on offer price — the data can change how we approach the number.",
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-mo-2",
        title: "Decide on contingencies",
        helperText: "Inspection, financing, appraisal — we'll talk through each.",
        richContent: rich(
          `<p>Contingencies protect you, but they can also affect how competitive your offer looks. We'll decide which ones make sense based on the property, the market, and your risk tolerance. In a competitive market, some buyers waive certain contingencies — I'll make sure you understand what you're giving up before we make that call.</p>`
        ),
        callChelseaNote: "Don't waive a contingency without talking to Chelsea first. It's usually not worth the risk.",
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-mo-3",
        title: "Submit offer and earnest money",
        helperText: "Earnest money is not automatically money you lose.",
        richContent: rich(
          `<p>Earnest money can feel scary, but it's not automatically money you lose. It's part of the offer and is typically refundable during the inspection period as long as we meet the contract deadlines. In our market, 1% of the purchase price is the general norm, but like everything else, it's negotiable.</p><p>Making an offer doesn't mean you have every answer yet — it means we're asking the seller to give you the first right to move forward while we do our due diligence.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-mo-4",
        title: "Negotiate terms if there's a counteroffer",
        helperText: "Almost everything is negotiable — buyers assume otherwise.",
        richContent: rich(
          `<p>Almost everything is negotiable: price, earnest money, closing date, repairs, credits, closing costs, even the inspection timeline. Buyers often assume terms are fixed when they're not — there's usually more room than people think. I'll walk you through any counteroffer and explain our options before responding.</p>`
        ),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-mo-5",
        title: "Get offer accepted and contract signed",
        helperText: "This is the start of due diligence, not the finish line.",
        richContent: rich(`<p>An accepted offer starts the clock on your inspection period and other contingency deadlines. We're not done — we're just beginning the most important part. I'll send you a timeline of what's due and when so nothing gets missed.</p>`),
        isRequired: true,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-due-diligence",
    title: "Under contract",
    shortDescription: "Inspection, appraisal, insurance — and the negotiation that actually matters.",
    richContent: rich(
      `<p>I view this period as one of the most valuable parts of the transaction. I once worked a deal where the sellers, going through an estate sale, initially said they didn't want to do anything and tried to limit the inspection to informational purposes only. I got them to agree to an expedited inspection period while removing that restriction, which preserved my buyers' ability to actually negotiate.</p><p>The home had already had a $25,000 price drop and was under market value, and we'd already secured 3% in closing costs — so rather than demanding every repair on the list, we focused on what mattered most and found a resolution that worked for everyone. That's usually how it goes: context matters more than the length of the list.</p>`
    ),
    sortOrder: 5,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-dd-1",
        title: "Schedule home inspection",
        helperText: "One of your most important protections as a buyer.",
        richContent: rich(
          `<p>The inspection is one of the most important parts of your protection as a buyer — and one of your best opportunities to learn about the home, understand your risk, and decide whether we need to ask for repairs, credits, a price reduction, or whether this is still the right home.</p><p>I connect buyers with inspectors who use strong tools and reporting: FLIR cameras, radon testing, sewer scopes, drone roof video. We want a thorough inspector who helps us actually understand the home, not just check a box.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: [
          {
            id: "rec-buyer-dd-inspector",
            vendorId: "vendor-home-insight",
            note: "Chelsea's go-to for thorough inspections with sewer scope and FLIR thermal imaging.",
            recommendationType: "recommended",
            sortOrder: 1
          }
        ]
      },
      {
        id: "tpl-buyer-dd-2",
        title: "Review inspection report and negotiate",
        helperText: "We won't treat the whole report as a repair list.",
        richContent: rich(
          `<p>This report may look overwhelming. That's normal — it includes everything the inspector notices, from small maintenance items to major concerns. We won't treat the whole report like a repair list.</p><div class="callout"><strong>What I prioritize:</strong> Safety issues, structural problems, water intrusion, roof life, electrical hazards, plumbing leaks, sewer problems, and major systems.<br><strong>What I de-emphasize:</strong> Cosmetic issues and normal wear for the home's age.</div><p>The goal isn't to get everything — it's to get what matters. The worst thing a seller can say is no, so don't be afraid to ask, but we'll stay realistic based on the report, the price, the seller's situation, and what's already been negotiated.</p>`
        ),
        callChelseaNote:
          "Call Chelsea as soon as you've read the inspection report. Don't draft a response list without talking first.",
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-dd-3",
        title: "Schedule appraisal",
        helperText: "Lender-ordered — you'll be notified when it's scheduled.",
        richContent: rich(`<p>The appraisal is ordered by your lender and confirms the home's value supports the loan amount. You typically don't need to do anything for this one — just know it's happening and watch for results. If the appraisal comes in low, we'll have a conversation about your options.</p>`),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-dd-4",
        title: "Get homeowner's insurance quotes",
        helperText: "Required by your lender before closing.",
        richContent: rich(`<p>Get quotes from at least two insurers. Your lender will require proof of insurance before closing. Make sure you understand what's covered, what isn't, and what the deductible is before you pick a policy. Flood insurance is separate from standard homeowner's insurance — check if your home is in a flood zone.</p>`),
        isRequired: true,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-dd-5",
        title: "Order title search and title insurance",
        helperText: "Protects you from title problems that predate your purchase.",
        richContent: rich(
          `<p>Title insurance protects you if a claim surfaces after closing related to something in the property's past — a lien, a disputed boundary, an error in the public record. It's not optional (your lender will require it), but the owner's policy is a one-time fee that protects you for as long as you own the home. Worth having.</p>`
        ),
        isRequired: true,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: [
          {
            id: "rec-buyer-dd-title",
            vendorId: "vendor-title-northwest",
            note: "Chelsea's preferred title and escrow partner for closings in this area.",
            recommendationType: "recommended",
            sortOrder: 1
          }
        ]
      },
      {
        id: "tpl-buyer-dd-6",
        title: "Finalize mortgage application and submit all documents",
        helperText: "Respond quickly to lender requests — delays here can delay closing.",
        richContent: rich(`<p>Your lender will likely ask for additional documents during this period: bank statements, pay stubs, tax returns, explanations for deposits or account activity. Respond quickly. Document delays are one of the most common reasons closings get pushed back.</p><p>Avoid opening new credit cards, making large purchases, or changing jobs during this period — it can affect your loan approval.</p>`),
        callChelseaNote: "If your lender asks for something unusual or asks you to do anything that feels off, call Chelsea before you respond.",
        isRequired: true,
        sortOrder: 6,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-final-steps",
    title: "Final steps before closing",
    shortDescription: "Clear-to-close is not the finish line. Several moving pieces remain.",
    richContent: rich(
      `<p>As closing approaches, buyers often think they're nearly done — but there are still a lot of moving pieces I'm watching: the walkthrough, Closing Disclosure delivery, your lender's clear-to-close, loan documents reaching escrow, your final cash to close, and how you'll deliver it.</p><p>Signing is not the same as closing, and I want you to go into this stage knowing that. I'll stay in close contact so you know exactly what's happening and what's expected of you at each step.</p>`
    ),
    sortOrder: 6,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-fs-1",
        title: "Get clear-to-close from your lender",
        helperText: "Important milestone — but not done yet.",
        richContent: rich(
          `<p>Clear-to-close is an important milestone, but it's not the end. We still need signing, lender review, funding, recording, and keys. When you get CTC, celebrate for a moment — but keep your schedule flexible for the final steps.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-fs-2",
        title: "Do a final walkthrough",
        helperText: "Confirm nothing has changed and agreed repairs are done.",
        richContent: rich(
          `<p>This is our chance to confirm the property is in the expected condition before closing. We're not re-inspecting the whole house — we're making sure nothing material has changed and any agreed repairs are complete. If something looks different, tell me immediately so we can address it before closing.</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-fs-3",
        title: "Review your Closing Disclosure",
        helperText: "Compare it to your original Loan Estimate — review it the day it arrives.",
        richContent: rich(
          `<p>Your Closing Disclosure needs to go out at least three business days before signing. This is a hard timing requirement. Review it carefully when it arrives rather than waiting. Compare it to your original Loan Estimate — some fees may have changed, and you're entitled to understand why.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-fs-4",
        title: "Arrange movers",
        helperText: "Book early — end-of-month dates fill up fast.",
        richContent: rich(`<p>Good movers book up, especially around end-of-month closings. Get this scheduled once your closing date is confirmed and before you're scrambling at the last minute.</p>`),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: [
          {
            id: "rec-buyer-fs-movers",
            vendorId: "vendor-spokane-movers",
            note: "Book as soon as your closing date is confirmed.",
            recommendationType: "recommended",
            sortOrder: 1
          }
        ]
      },
      {
        id: "tpl-buyer-fs-5",
        title: "Set up utilities at the new address",
        helperText: "Electric, water, gas, internet — transfer effective closing day.",
        richContent: rich(`<p>Contact utility providers for the new address and set up transfers effective on or before closing day. You don't want to close and then spend your first night without power or internet because you forgot.</p>`),
        isRequired: false,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-fs-6",
        title: "Arrange certified funds or wire for closing costs",
        helperText: "Confirm the exact amount and how to deliver it before closing day.",
        richContent: rich(
          `<p>Before signing, we need to know exactly how much money you need to bring and how it'll be delivered. For a same-day close, wiring may be necessary. If you're using a cashier's check, get it arranged at least 24 hours before closing and delivered to the closer.</p><div class="callout"><strong>Wire fraud warning:</strong> Wire instructions should always be confirmed directly with your closer by phone — not just from an email. Fraud attempts targeting real estate closings are real. If you get new or changed wire instructions via email, call your closer before acting on them.</div>`
        ),
        callChelseaNote: "If you're unsure about wire instructions or something feels off, call Chelsea immediately.",
        isRequired: true,
        sortOrder: 6,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-closing-day",
    title: "Closing day",
    shortDescription: "You're signing today — but the keys come after the sale records.",
    richContent: rich(
      `<p>Signing is not closing — buyers often assume they get keys right after signing, and that's just not how the sequence works. After you sign: the lender reviews the signed documents, sends the funding wire, escrow receives funds, escrow sends documents to the county, the county records the sale — and then keys are released. I'll be tracking all of it so you're not left wondering what's happening.</p>`
    ),
    sortOrder: 7,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-cd-1",
        title: "Bring ID and certified funds or proof of wire",
        helperText: "Don't forget — no ID means no signing.",
        richContent: rich(`<p>Bring a government-issued photo ID and either your certified funds or confirmation that your wire has been sent. If you wired funds, bring the confirmation or receipt. Your closer will let you know exactly what's needed.</p>`),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-cd-2",
        title: "Sign closing documents",
        helperText: "Signing is the step before closing — the sequence continues after.",
        richContent: rich(
          `<p>You're signing today, but this doesn't mean we're officially closed yet. After you sign: the lender reviews the signed documents, sends the funding wire, escrow receives funds, escrow sends documents to the county, the county records the sale — and then keys are released. I try to be there at signing whenever I can.</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-cd-3",
        title: "Get your keys",
        helperText: "This is the real finish line.",
        richContent: rich(
          `<p>This is the real finish line. It's not done until you get the keys. Once the county records the sale, your closer will release keys. Sometimes this happens same-day, sometimes it's late in the day — I'll stay on top of it so you're not waiting and wondering.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-cd-4",
        title: "Confirm home warranty paperwork",
        helperText: "If a home warranty was purchased, get the details now.",
        richContent: rich(`<p>If a home warranty was part of the deal, make sure you have the policy information and know how to file a claim before something actually goes wrong.</p>`),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-buyer-after-move-in",
    title: "After you move in",
    shortDescription: "The first things to know about your new home.",
    richContent: rich(
      `<p>I don't disappear after closing. One thing that catches new owners off guard: you may receive a water bill after closing related to the prior owner's usage. Don't panic — in many cases the closer held back funds from the seller at closing specifically to cover that, and it gets paid through escrow. If something like that shows up and you're not sure, just ask me before assuming you owe it.</p><p>Reach out any time. The relationship doesn't end at closing.</p>`
    ),
    sortOrder: 8,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-buyer-ami-1",
        title: "Locate main water shutoff, breaker panel, and gas shutoff",
        helperText: "Know where these are before you need them in an emergency.",
        richContent: rich(
          `<p>Now that you own the home, take some time to find these. These are things you don't want to be searching for the first time during an actual emergency. Walk through the home and locate the main water shutoff, electrical breaker panel, and (if applicable) gas shutoff. Make sure everyone in the household knows where they are.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-ami-2",
        title: "Update your address everywhere",
        helperText: "DMV, bank, employer, voter registration, subscriptions.",
        richContent: rich(`<p>Update your address with: USPS (forward mail first), your bank, your employer's HR, your state's DMV, voter registration, and any subscription services. The USPS forward takes a few days to kick in, so get it started immediately.</p>`),
        isRequired: false,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-ami-3",
        title: "Schedule move-in repairs or upgrades",
        helperText: "Easier before your furniture is in.",
        richContent: rich(`<p>If you want to paint, refinish floors, or do any work before moving in fully, now is the time. It's much easier to do work in an empty or partially empty home.</p>`),
        isRequired: false,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-buyer-ami-4",
        title: "Save all closing documents",
        helperText: "I'll send your closing statement — keep it for taxes.",
        richContent: rich(
          `<p>I'll send your closing statement after closing so you have it for your records and for taxes. Save your closing documents somewhere safe, both digitally and physically. Your settlement statement (HUD-1 or ALTA) may be useful when you sell, for tax deductions, or for any title question that comes up later.</p>`
        ),
        isRequired: true,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// Seller template stages
// ---------------------------------------------------------------------------

const sellerStages: ClientChecklist["stages"] = [
  {
    id: "tpl-seller-choosing-agent",
    title: "Choosing your agent",
    shortDescription: "Formalize our relationship and align on strategy before we do anything else.",
    richContent: rich(
      `<p>The listing agreement formalizes our working relationship and gives me permission to represent you and market the home. But this conversation is about more than paperwork. It's where I walk you through my pricing approach, what I'm going to do before the listing goes live, and what to expect at every step.</p><p>Sellers sometimes feel like once they sign, they hand things over and wait. What I try to do instead is make sure you understand what's happening and why at each stage, so nothing feels like a surprise.</p>`
    ),
    sortOrder: 1,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-ca-1",
        title: "Interview your agent and ask about their process",
        helperText: "Pricing approach, marketing plan, communication style.",
        richContent: rich(
          `<p>Not all agents market the same way. Before you commit, ask specifically how they'll price your home, what marketing they'll do beyond putting it on MLS, how they communicate during the listing period, and what happens if the home sits. The answers will tell you whether you're getting a strategy or just a sign in the yard.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-ca-2",
        title: "Discuss timing, pricing strategy, and what to expect",
        helperText: "Your timeline shapes almost every decision.",
        richContent: rich(
          `<p>Your timeline affects almost every decision: pricing, prep, showing availability, possession, offer terms, and closing. Before we make any decisions, I want to understand what you're trying to accomplish and what constraints we need to work around. Are you buying something next? Do you need a specific closing date? Are there life events driving the timeline?</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-ca-3",
        title: "Review the Listing Agreement together",
        helperText: "Compensation, term, and marketing rights — before you sign.",
        richContent: rich(
          `<p>Compensation is negotiable and not set by law — in Washington, your listing agreement must disclose this. Pricing strategy and buyer-agent compensation should be understood as separate decisions that affect your overall net and marketability. We'll look at all of it together.</p><p>Before signing, understand what happens if the home doesn't sell — can you cancel if things aren't working, and what are the conditions? These are fair questions to ask before you're locked in.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-ca-4",
        title: "Sign the Listing Agreement",
        helperText: "Sent separately for e-signature.",
        richContent: rich(`<p>Once you've reviewed everything and your questions are answered, the listing agreement is sent separately for e-signature. This is what formally authorizes me to represent you and market the home.</p>`),
        isRequired: true,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-seller-preparing",
    title: "Preparing to sell",
    shortDescription: "Pricing, timing, and deciding what's worth fixing before we go live.",
    richContent: rich(
      `<p>Selling starts with understanding your home, your timeline, and what you need to walk away with. Before we make decisions about price, prep, or timing, I want to see the space, review the available data, and talk through your goals.</p><p>Sellers often come in with a number in mind — from Zillow, from a neighbor's sale, from what they need to make the math work. I take all of that seriously, but pricing has to be grounded in what's actually happening in the market right now. I'd rather have that honest conversation early than have you sitting on the market wondering why it isn't selling.</p>`
    ),
    sortOrder: 2,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-prep-1",
        title: "Get a comparative market analysis",
        helperText: "What's actually selling now — not a website estimate.",
        richContent: rich(
          `<p>Pricing is not just about what we hope the home is worth. It's about how buyers will compare your home to everything else available right now. I'll look at recent sales, active competition, days on market, price trends, and seasonal timing — not a number from a website.</p><p>Online estimates can be a starting point, but they don't know the full story of your home: condition, improvements, layout, or buyer demand right now. In some cases they're significantly off — either too high or too low.</p>`
        ),
        callChelseaNote: "Call Chelsea before you factor any online estimate into your expectations. Let's look at real comps together first.",
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-prep-2",
        title: "Decide on timing and any buying contingencies",
        helperText: "If you're buying next, we need to plan around both transactions.",
        richContent: rich(
          `<p>Timing a sale when you're also buying creates real coordination pressure — you may need the proceeds from this sale to close on the next one, or you may need a place to live in between. We'll talk through your situation early so we can build a realistic plan.</p><p>There are options: rent-back arrangements, extended possession, bridge financing. The right answer depends on your specific situation — not a generic recommendation.</p>`
        ),
        callChelseaNote: "If you're buying and selling simultaneously, talk to Chelsea early. This needs a coordinated plan, not improvisation.",
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-prep-3",
        title: "Identify repairs worth making before listing",
        helperText: "Not every repair pays off — we'll focus on what affects buyer confidence.",
        richContent: rich(
          `<p>Not every repair is worth doing before listing — some things are already priced into the market value, and some improvements won't return what they cost. What we're looking for are the things that make buyers hesitate or reduce their offers: deferred maintenance that signals neglect, obvious safety issues, things that will likely come up in an inspection anyway.</p><p>I'll help you focus on what actually affects buyer confidence and offer strength — not what would make the home perfect for you to keep living in.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-prep-4",
        title: "Declutter and depersonalize",
        helperText: "Don't empty everything before we have a staging plan.",
        richContent: rich(
          `<p>It's helpful to declutter, but try not to empty the home before we have a staging plan. Sometimes existing furniture or decor can help the home feel warmer and more complete in photos and showings. Let's make a plan before clearing everything out — some things should go, some things should stay.</p>`
        ),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-prep-5",
        title: "Discuss staging options",
        helperText: "Staging isn't always furniture — sometimes it's just editing.",
        richContent: rich(
          `<p>Staging doesn't always mean bringing in furniture. Sometimes it means rearranging what you have, removing excess items, or just getting the home cleaned and lit right for photos. The goal is helping buyers see themselves in the space.</p><p>We'll use a practical room-by-room plan so you know what to remove, what to keep, what to clean, and what needs to be ready before photos.</p>`
        ),
        isRequired: false,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-seller-listing-prep",
    title: "Getting listing-ready",
    shortDescription: "Repairs, photos, disclosures — go live in the strongest position.",
    richContent: rich(
      `<p>A lot happens between signing the listing agreement and the day your home goes live — and most of it is on a tight timeline. I'm coordinating repairs, photography, disclosures, and MLS timing simultaneously.</p><p>The goal is to hit the market in the strongest possible position: fully prepared, professionally photographed, and priced right. Going live before the home is ready costs you — buyers who see it in rough form often don't come back, even after improvements. I'd rather take an extra week and launch right than rush it out and have to explain why the price dropped.</p>`
    ),
    sortOrder: 3,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-lp-1",
        title: "Complete agreed-upon repairs and touch-ups",
        helperText: "Get repairs done before photography, not after.",
        richContent: rich(
          `<p>Get repairs done before photography, not after. Buyers form their first impression from online photos — we want the home to look finished and cared-for from the moment it hits the market.</p><p>Some repairs are worth doing because they reduce buyer objections. Others may not be worth fixing and can be disclosed or handled later. We'll focus on what affects buyer confidence, safety, financing, and likely inspection negotiations.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-lp-2",
        title: "Deep clean and stage the home",
        helperText: "Clean homes photograph better and give buyers more confidence.",
        richContent: rich(
          `<p>Clean homes photograph better and give buyers more confidence. This includes surfaces, floors, bathrooms, kitchens, windows if needed, and areas buyers may open or inspect. Before we schedule photos and video, staging, cleaning, decluttering, and major prep items should be complete.</p><p>Once media is done, we want the listing to look consistent with what buyers will see in person.</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-lp-3",
        title: "Schedule professional photography",
        helperText: "Buyers form their impression before they ever schedule a showing.",
        richContent: rich(
          `<p>Photos and video are usually the buyer's first impression — this is when your preparation becomes buyer-facing. Most buyers form their impression before they ever schedule a showing. Good photography directly affects how many people walk through your door.</p><p>I coordinate photography after the home is fully staged and ready, not before. After photos, try to keep the home close to the way it was photographed.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-lp-4",
        title: "Review and sign disclosure documents",
        helperText: "Washington requires disclosure of known material defects.",
        richContent: rich(
          `<p>Washington state requires sellers to disclose known material defects. This is not optional, and it's not something to guess at. We'll go through the disclosure form together.</p><p>If you're not sure whether something needs to be disclosed, the answer is almost always to disclose it — transparency protects you and keeps the transaction on track. Buyers can ask for repair credits; they can't ask for things that were honestly disclosed upfront.</p>`
        ),
        callChelseaNote: "If you're unsure whether something needs to be disclosed, call Chelsea before you decide.",
        isRequired: true,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-lp-5",
        title: "Set a showing schedule and access instructions",
        helperText: "The easier it is to show, the more offers we can receive.",
        richContent: rich(
          `<p>Once the home is live, buyer access matters. The easier it is for qualified buyers to see the home, the more opportunity we have for activity and offers. A home that's hard to show gets shown less.</p><p>We'll set showing expectations ahead of time so the process works for your life while still giving the home the best chance to sell. If you have pets, specific windows, or any access constraints, we'll build a plan around those.</p>`
        ),
        isRequired: true,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-seller-on-market",
    title: "On the market",
    shortDescription: "I'm watching the market response closely — not waiting.",
    richContent: rich(
      `<p>Once we're live, the first week or two is when I'm watching most closely. Showing requests, feedback from buyer agents, online traffic — all of it tells us whether the market is responding the way we expected.</p><p>Sellers often feel like this is the part where they just wait. I'm not waiting — I'm tracking, asking questions, following up with agents who showed the home, and making sure we understand what's happening. If something needs to change, I'd rather tell you early and clearly than let weeks pass before we have that conversation.</p>`
    ),
    sortOrder: 4,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-om-1",
        title: "Listing goes live on MLS and major sites",
        helperText: "Syndication to Zillow, Realtor.com, and others happens automatically.",
        richContent: rich(`<p>Once the listing is active in MLS, it syndicates automatically to major sites — Zillow, Realtor.com, Redfin, and others. This typically takes a few hours. I'll confirm it's live and looking right before the day is out.</p>`),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-om-2",
        title: "Keep the home show-ready",
        helperText: "The most exhausting part — but showings are how we get offers.",
        richContent: rich(
          `<p>This is the part sellers find most exhausting: keeping the home looking listing-quality day after day while living in it. Buyers often want to see a home on short notice.</p><p>Before showings: lights on if practical, pets secured, counters cleared, and access simple. Buyers should be able to focus on the home. The more flexible you can be, the more showings we can receive — and showings are how we get offers.</p>`
        ),
        isRequired: false,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-om-3",
        title: "Review showing activity and feedback with Chelsea",
        helperText: "Volume in the first week is one of the clearest market signals we have.",
        richContent: rich(
          `<p>Showing volume in the first week or two is one of the clearest market signals we have. If a well-priced, well-presented home isn't getting showings, the market is telling us something. If it's getting showings but no offers, the feedback from agents and buyers will usually tell us why.</p><p>I track this closely and share it with you. We won't wait six weeks before having a difficult conversation — if something needs to change, we'll talk about it early when we still have options.</p>`
        ),
        callChelseaNote: "Chelsea will reach out after the first week with a showing summary. If you have questions or concerns before then, don't wait.",
        isRequired: false,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-seller-reviewing-offers",
    title: "Reviewing offers",
    shortDescription: "The highest offer is not always the strongest offer.",
    richContent: rich(
      `<p>The highest offer is not always the strongest offer. My job is to help you pick the right horse to make it over all the hurdles and get to the finish line.</p><p>We need to look at price, financing, lender strength, contingencies, timing, inspection terms, special requests, and how likely the buyer is to actually close. I'll explain each offer in plain terms so you can make a decision based on the full picture — not just the number at the top.</p>`
    ),
    sortOrder: 5,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-ro-1",
        title: "Review all offer terms, not just price",
        helperText: "Financing type, contingencies, timeline, and buyer strength all matter.",
        richContent: rich(
          `<p>An offer is a package, not just a number. The financing type matters: a cash offer has no appraisal risk and no lender timeline. A conventional loan is generally more reliable than FHA or VA if your home has condition issues that might affect an appraisal.</p><p>We also need to look at contingencies, inspection timelines, possession terms, home warranty requests, included or excluded items, and any unusual clauses before deciding how to respond. I may contact the buyer's lender to understand how strong the buyer actually is.</p>`
        ),
        callChelseaNote: "Call Chelsea before deciding how to respond to any offer — especially if something feels off or too good.",
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-ro-2",
        title: "Negotiate price, terms, or inspection provisions",
        helperText: "Almost everything is negotiable — we'll look at each lever.",
        richContent: rich(
          `<p>Almost everything is negotiable: price, earnest money, closing date, possession timing, what stays with the home, and whether you make repairs or give credits instead. Negotiation doesn't stop at the offer — it continues through counteroffers, inspection responses, and appraisal gaps.</p><p>I'll help you understand your leverage at each point and what concessions are worth making vs. which ones signal weakness unnecessarily.</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-ro-3",
        title: "Accept an offer and open escrow",
        helperText: "A real milestone — but inspection, appraisal, and closing still ahead.",
        richContent: rich(
          `<p>Once we have an accepted offer, escrow is opened with the title company and the clock starts on the buyer's inspection period. This is a real milestone — but it's not the finish line. There are still inspection negotiations, an appraisal, financing approval, and final closing steps ahead.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: [
          {
            id: "rec-seller-ro-title",
            vendorId: "vendor-title-northwest",
            note: "Chelsea's preferred title company for coordinating escrow once an offer is accepted.",
            recommendationType: "recommended",
            sortOrder: 1
          }
        ]
      }
    ]
  },
  {
    id: "tpl-seller-under-contract",
    title: "Under contract",
    shortDescription: "Inspection, appraisal, and the negotiation that often matters most.",
    richContent: rich(
      `<p>Being under contract as a seller can feel passive — you're waiting while the buyer does their inspection, gets their appraisal, works through their loan. But this is a period I'm actively managing on your behalf.</p><p>I'm tracking deadlines, staying in contact with the buyer's agent, watching for anything that could affect the closing, and making sure we don't miss a response window. The inspection negotiation, if there is one, is usually the most significant moment here — and it's where having an experienced advocate makes the most difference.</p>`
    ),
    sortOrder: 6,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-uc-1",
        title: "Accommodate the buyer's inspection",
        helperText: "Leave the home accessible — they'll be there for several hours.",
        richContent: rich(
          `<p>During a showing, buyers may be in the home for 20 minutes. During inspection, the buyer and inspector may be there for several hours — this is when they lift the hood and look at the engine.</p><p>You don't need to be present. Leave the home clean, accessible, cobwebs cleared, bulbs working, and access open to the electrical panel, water heater, furnace, attic, and crawlspace. The report goes to the buyer first, and then we'll wait to see what they ask for.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-uc-2",
        title: "Negotiate any repair requests or credits",
        helperText: "Context matters more than the length of the list.",
        richContent: rich(
          `<p>Inspection negotiations are often where expectations collide. Buyers may want major repairs or credits; sellers may feel they already priced the home fairly.</p><p>Before responding, we need to look at the full picture: what was already negotiated, whether the home is under market, whether the buyer may walk, and whether refusing a small request could cost more than fixing it.</p><div class="callout"><strong>A real example:</strong> I once had a seller who didn't want to do anything after already coming down on price. The buyer asked for satellite dish removal and caulking — items that were likely a $100 contractor job. Refusing that and risking the sale, another mortgage payment, and starting over with a new buyer didn't make sense. The goal isn't to give away everything. It's to choose the response that protects your net, your timeline, and your ability to close.</div>`
        ),
        callChelseaNote: "Don't respond to an inspection request without talking to Chelsea first. The right answer depends on context she needs to explain.",
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-uc-3",
        title: "Accommodate the buyer's appraisal",
        helperText: "Home should be clean and show-ready for the appraiser.",
        richContent: rich(
          `<p>The lender will order an appraisal to confirm the home's value supports the loan amount. The home should be clean and show-ready for the appraiser — they're judging value and condition. If the appraisal comes in at or above the contract price, we move on. If it comes in low, we'll need to negotiate. I'll walk you through the options if this comes up.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-uc-4",
        title: "Continue maintaining the home until closing",
        helperText: "Keep up the yard and continue current maintenance.",
        richContent: rich(`<p>Continue maintaining the home the same way you have been — mow the lawn, address any obvious maintenance, and keep it in the condition buyers expect based on what they saw. Changes in condition between offer acceptance and closing can create problems at the final walkthrough.</p>`),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-uc-5",
        title: "Respond promptly to title and lender document requests",
        helperText: "Slow responses on your end can delay closing.",
        richContent: rich(`<p>Closing timelines are tight, and document requests often have hard deadlines. A slow response on your end can delay closing. I'll flag anything time-sensitive and make sure you know what's needed and when.</p>`),
        isRequired: true,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-seller-preparing-close",
    title: "Preparing to close",
    shortDescription: "Movers, utilities, final walkthrough — the logistics stack up fast.",
    richContent: rich(
      `<p>As closing gets close, the logistics stack up on your end: movers, utilities, your own move-out. I'm watching the transaction timeline at the same time — making sure the buyer's loan is cleared, closing documents are on track, and we're not going to hit a last-minute snag.</p><p>The last few details matter more than people expect. Sellers sometimes feel like they're just waiting at this point, but there's still a lot that can affect whether we close on time and on good terms. I'll stay in close contact so you know what's happening in the final days.</p>`
    ),
    sortOrder: 7,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-pc-1",
        title: "Schedule movers and a move-out date",
        helperText: "Book early — end-of-month closing dates fill up fast.",
        richContent: rich(
          `<p>Book movers early — they fill up, especially around end-of-month closing dates. Your move-out date needs to align with the closing date and any possession arrangement in the contract. If you negotiated a rent-back, make sure your moving timeline reflects that.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: [
          {
            id: "rec-seller-pc-movers",
            vendorId: "vendor-spokane-movers",
            note: "Book as soon as your closing date is confirmed.",
            recommendationType: "recommended",
            sortOrder: 1
          }
        ]
      },
      {
        id: "tpl-seller-pc-2",
        title: "Do NOT cancel utilities before closing day",
        helperText: "Keep power, water, and gas on until I confirm it's safe to transfer.",
        richContent: rich(
          `<p>Please do not shut off power, water, or other utilities before closing unless I confirm the timing. Utilities may be needed for the buyer's final walkthrough, appraisal, repairs, cleaning, and the closing process itself — which can sometimes run late in the day.</p><div class="callout"><strong>Real example:</strong> I once had a seller shut off power early before closing. The ice maker in the refrigerator melted and I had to rush over with towels to clean up a wet kitchen floor before we could close. Don't let that be you. Arrange transfers effective the date of closing, not before.</div>`
        ),
        callChelseaNote: "Call Chelsea before canceling or transferring any utilities — timing this wrong can literally delay closing.",
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-pc-3",
        title: "Cancel or transfer homeowner's insurance",
        helperText: "Transfer effective closing day — not before.",
        richContent: rich(`<p>Cancel or transfer your homeowner's insurance effective on closing day. Don't cancel early — you're still responsible for the property until recording. Contact your insurer to set up the transfer once your closing date is confirmed.</p>`),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-pc-4",
        title: "Prepare for the buyer's final walkthrough",
        helperText: "Leave it clean and in the agreed condition — no surprises.",
        richContent: rich(
          `<p>The buyer will do a final walkthrough, typically in the 24 hours before closing. This isn't a re-inspection — they're confirming the home is in the expected condition, agreed repairs are complete, grass is mowed, nothing material has changed, and personal property is removed.</p><p>Leave the home clean and in the condition you agreed to. If anything has changed since the offer was accepted, let me know before the walkthrough so we can address it proactively rather than at the closing table.</p>`
        ),
        isRequired: true,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-pc-5",
        title: "Gather keys, remotes, codes, and manuals to leave behind",
        helperText: "A complete handoff is part of the condition you're delivering.",
        richContent: rich(
          `<p>A complete handoff — house keys, mailbox keys, garage remotes, gate cards, codes, smart lock instructions — is part of the condition you're delivering at closing. If you have appliance manuals, warranty documents, or HOA materials, leave those too. Let me know where everything will be left so the handoff to the buyer is clean and nobody is scrambling after recording.</p>`
        ),
        isRequired: true,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  },
  {
    id: "tpl-seller-closing-day",
    title: "Closing day",
    shortDescription: "Sign, then wait for recording — your proceeds arrive after that.",
    richContent: rich(
      `<p>Sellers often expect to walk away from signing with a check, and that's usually not how it works. There are a few steps between signing and your money actually arriving: funding, recording, then disbursement.</p><p>I'll make sure you know the timeline in advance so you're not waiting and wondering. Once it's done — it's done. Thank you for trusting me with such an important transition. Reach out if any questions come up after closing.</p>`
    ),
    sortOrder: 8,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: [
      {
        id: "tpl-seller-cd-1",
        title: "Sign closing documents",
        helperText: "Sellers can often sign a day or two before the closing date.",
        richContent: rich(
          `<p>Sellers can often sign a day or two before the official closing date, and I like to get this scheduled early so the end doesn't become a scramble. After you sign: the buyer's lender reviews the documents, sends the funding wire, escrow receives funds, documents go to the county for recording, and then the sale is official.</p><p>Your proceeds are disbursed after recording — usually the same day, sometimes the next business day depending on timing.</p>`
        ),
        isRequired: true,
        sortOrder: 1,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-cd-2",
        title: "Hand over keys and access items",
        helperText: "Keys transfer at or after recording — not at signing.",
        richContent: rich(
          `<p>Keys transfer at or after closing — once the sale has officially recorded. Don't hand keys to the buyer before we have confirmation that the sale has recorded. I'll let you know when it's official.</p>`
        ),
        isRequired: true,
        sortOrder: 2,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-cd-3",
        title: "Confirm proceeds disbursement with escrow",
        helperText: "Wire is faster — especially if you're closing on your next home the same day.",
        richContent: rich(
          `<p>Your net proceeds — the sale price minus your payoff, agent compensation, excise tax, title and escrow fees, any credits you gave the buyer, and prorations — will be disbursed by the title company. Confirm before closing how you want to receive funds: wire transfer or check. Wire is faster, which matters if you're also closing on your next home the same day.</p>`
        ),
        isRequired: true,
        sortOrder: 3,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-cd-4",
        title: "Save your closing statement",
        helperText: "I'll send it after closing — keep it for taxes.",
        richContent: rich(`<p>I'll send your closing statement after closing. Save this with your records — it may be useful for taxes or future reference. Your net proceeds calculation is also in here.</p>`),
        isRequired: false,
        sortOrder: 4,
        isComplete: false,
        vendorRecommendations: []
      },
      {
        id: "tpl-seller-cd-5",
        title: "Update your address everywhere",
        helperText: "USPS forward, bank, employer, DMV.",
        richContent: rich(`<p>Update your address with USPS (set up a mail forward first), your bank, your employer, the DMV, voter registration, and any subscription services. USPS forwarding takes a couple of days to activate — get it started as soon as you have your new address.</p>`),
        isRequired: false,
        sortOrder: 5,
        isComplete: false,
        vendorRecommendations: []
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// Master templates
// ---------------------------------------------------------------------------

export const masterTemplates: MasterTemplate[] = [
  {
    id: "tpl-buyer-v1",
    name: "Buyer checklist",
    journeyType: "buyer",
    version: 1,
    stages: buyerStages.map((stage) => ({ ...stage, isCurrent: false }))
  },
  {
    id: "tpl-seller-v1",
    name: "Seller checklist",
    journeyType: "seller",
    version: 1,
    stages: sellerStages.map((stage) => ({ ...stage, isCurrent: false }))
  }
];

// ---------------------------------------------------------------------------
// Demo client checklists
// ---------------------------------------------------------------------------

export const clientChecklists: ClientChecklist[] = [
  {
    id: "checklist-demo-buyer",
    privateLinkToken: "demo-buyer",
    clientName: "Alex and Jordan",
    clientEmail: "alex-jordan@example.com",
    journeyType: "buyer",
    status: "active",
    stages: buyerStages.map((stage, index) => ({
      ...stage,
      isCurrent: index === 2
    }))
  },
  {
    id: "checklist-demo-seller",
    privateLinkToken: "demo-seller",
    clientName: "The Hendersons",
    clientEmail: "henderson@example.com",
    journeyType: "seller",
    status: "active",
    stages: sellerStages.map((stage, index) => ({
      ...stage,
      isCurrent: index === 1
    }))
  },
  {
    id: "checklist-demo-buyer-seller",
    privateLinkToken: "demo-buyer-seller",
    clientName: "Priya and Marcus",
    clientEmail: "priya-marcus@example.com",
    journeyType: "buyer_seller",
    status: "active",
    stages: [
      ...sellerStages.map((stage, index) => ({
        ...stage,
        journeyTrack: "seller" as const,
        isCurrent: index === 1
      })),
      ...buyerStages.map((stage, index) => ({
        ...stage,
        journeyTrack: "buyer" as const,
        isCurrent: index === 0
      }))
    ]
  }
];
