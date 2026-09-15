import type { FlowNode, FlowEdge } from "@/components/ui/AgentFlow";
import type { SampleCardData } from "@/components/ui/SampleCard";
import type { Stat } from "@/content/design";

/* ============================================================================
   AGENTIC AI
   ============================================================================
   Its own section, from the nav down, and it is the page this site exists to
   land. Everywhere else argues that the design and the building are one job.
   This one argues something narrower and harder to claim: that the author
   scopes agentic work, makes a model justify itself before it acts, and
   decides deliberately where a person stays in the loop. Four agents running
   against a live wholesale business are the evidence.

   WHAT CHANGED. This file used to hold `body: []` and a pointer at the
   DrawEvolve case study, on the standing rule that nothing is invented and an
   empty field renders nothing. The page rendered a heading and a link.

   The rule has not been abandoned, it has been satisfied: every claim below
   about what an agent does, what it checks, what it refuses to decide and
   who it hands to came from the author. What is NOT from the author is
   marked and handled two ways. Facts that do not exist yet — how long the
   billing agent has run, how many tickets a day it sees — are `todo` entries
   that render in development only. And every value inside a sample artefact
   is invented on purpose and is kept clear of anything that could be mistaken
   for a real account, product or figure.

   THE CARD NO LONGER SAYS SO. Each one carried "Sample artefact. Every value
   in it is invented." underneath it; all three lines are removed and the
   field with them. The rule that the values are invented still holds and is
   now kept here rather than enforced by a type. See
   components/ui/SampleCard.tsx.

   THE DRAWEVOLVE POINTER IS GONE. It was here because the "How I worked"
   passage in that case study was the only writing on the site about agents,
   so this page borrowed it. This page now has its own argument and no longer
   needs to send a reader somewhere else to find one.

   NO STAT IS SET ON ANY AGENT. The `stat` slot renders an oversized figure
   and omits itself entirely when null, which is what all four are, because
   no numbers have been supplied. A page about deciding what a system is
   allowed to assert would be a strange place to start estimating.
   ========================================================================= */

export type AgentSection = {
  /** Anchor id, and the subnav's target. */
  slug: string;
  /** The subnav label. Short. */
  nav: string;
  title: string;
  /** One line under the title. */
  deck: string;
  body: string[];
  /**
   * The sentence the section exists to deliver, set apart from the prose.
   * Every agent has one; this is the page's whole rhythm.
   */
  point: string;
  flow: {
    label: string;
    caption: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  sample?: { label: string; data: SampleCardData };
  /** Null omits the slot entirely. Never estimated. See the header. */
  stat: Stat | null;
  /** Development only, never rendered in production. */
  todo: string[];
};

export const method = {
  title: "Method",
  body: [
    "Every one of these was built the same way: investigate, propose, implement, with an explicit approval between each step. The model investigates and proposes. I decide.",
    "The approvals are the entire product decision. Generation is cheap now; a model will write the billing agent in an afternoon. What costs something is knowing where it is allowed to act on its own conclusions and where it has to stop and show its work, which is what decides whether you can point one at a live business.",
    "An agent that acts without justifying what it is about to do is unreviewable. Attach an unreviewable process to a system that sends invoices and you have a liability.",
  ],
};

export const agents: AgentSection[] = [
  /* ---------------------------------------------------------------- 01 -- */
  {
    slug: "billing",
    nav: "Billing",
    title: "The billing agent",
    deck: "Runs daily against the day's picking tickets, bills what is clean, and refuses to guess at anything that is not.",
    body: [
      "Every day the warehouse scans its picking tickets to a shared drive. The agent reads the day's batch, and for each ticket it goes to NetSuite and establishes three things: that the items on the ticket are the items on the order, that the quantities picked are the quantities sold, and that the order has not already been invoiced.",
      "Where all three hold, it bills the order and formally sends the billing. Where any of them does not, it stops and writes the ticket into an exception report for a person, with the reason attached.",
      "The exceptions are not rare. They are the ordinary texture of a wholesale operation. A quantity picked short because that is what was on the shelf. An order that was prepaid, where invoicing would charge twice. Shipping a rep comped over the phone. A note somebody wrote on the ticket in pen, which is a real instruction from a real person that exists nowhere in the ERP. Each of those has a defensible automatic answer. The agent is not allowed to reach for any of them.",
    ],
    point:
      "Deciding what the agent is not allowed to decide is the design work here. The automation around it is plumbing.",
    flow: {
      label:
        "The billing agent's daily run: read tickets, match to NetSuite, verify items, quantities and invoice status, then fork, with clean orders invoiced and sent automatically and anything unusual held and routed to a person",
      caption:
        "The fork at step three is the whole design. Everything before it is verification. What happens after it depends on who is allowed to make the call.",
      nodes: [
        { id: "scan", label: "The day's scanned picking tickets", kind: "auto", col: 0 },
        { id: "match", label: "Match each to its NetSuite order", kind: "auto", col: 1 },
        { id: "verify", label: "Items, quantities, not already invoiced", kind: "auto", col: 2 },
        { id: "invoice", label: "Invoice the order", kind: "auto", col: 3 },
        { id: "send", label: "Send the billing", kind: "auto", col: 4 },
        { id: "hold", label: "Hold, with the reason attached", kind: "flag", col: 3, row: 1 },
        { id: "human", label: "A person decides", kind: "human", col: 4, row: 1 },
      ],
      edges: [
        { from: "scan", to: "match" },
        { from: "match", to: "verify" },
        { from: "verify", to: "invoice", label: "Clean" },
        { from: "invoice", to: "send" },
        { from: "verify", to: "hold", label: "Unusual" },
        { from: "hold", to: "human" },
      ],
    },
    sample: {
      label: "A sample exception report from the billing agent",
      data: {
        chrome: [
          { label: "Run", value: "daily, 06:15" },
          { label: "Source", value: "/scans/picking-tickets/" },
          { label: "Action", value: "held, not invoiced" },
        ],
        title: "Held for review",
        rows: [
          {
            tag: "Quantity",
            tone: "flag",
            title: "Ticket shows twelve units picked against an order for ten",
            body: "Could be a short-ship correction or a picking error. Both are plausible and they bill differently, so neither is assumed.",
          },
          {
            tag: "Prepaid",
            tone: "flag",
            title: "Payment already applied against this order",
            body: "Invoicing it would charge the account twice. The agent has no authority to decide whether a credit is the right answer.",
          },
          {
            tag: "Manual",
            tone: "flag",
            title: "Handwritten note on the scanned ticket",
            body: "Freight marked as comped by the rep. Nothing in the ERP can confirm it.",
          },
        ],
        footer:
          "Every other ticket on this run was verified, invoiced and sent without intervention.",
      },
    },
    stat: null,
    todo: [
      "ANSWER: how long the billing agent has been running.",
      "ANSWER: daily ticket volume. This is the one number that would turn the section from a description into a measurement. The <StatRow> slot is already wired to take it: set `stat` and it appears.",
      "ANSWER: roughly what share of a run comes back clean, if that is knowable and not sensitive.",
    ],
  },

  /* ---------------------------------------------------------------- 02 -- */
  {
    slug: "competitive-intel",
    nav: "Competitive Intel",
    title: "The competitive intelligence agent",
    deck: "Watches what our largest accounts are actually selling, and reads what the changes mean.",
    body: [
      "It monitors the websites of the company's largest accounts, scrapes their product and pricing data, and diffs each run against the last one. It is looking for movement in items supplied by our largest competitor: something of theirs appearing on a shelf that did not carry it, something disappearing, something whose price has moved.",
      "The diff is the easy half. A list of changed rows is something anybody can generate and nobody reads. The agent's job starts after it, taking a change and saying what it indicates for us. That an account has opened a second supplier. That a line we compete on is being discounted. That a category is being quietly exited.",
    ],
    point:
      "A change log is data. A read on what the change means is something somebody can act on. Getting a model to produce the second without inventing the first is most of the work.",
    flow: {
      label:
        "The competitive intelligence agent: crawl account sites, extract product and pricing data, diff against the previous run, flag competitor movement, interpret what it signals, then brief a person",
      caption:
        "Only one step here is a diff. The agent exists for the step after it.",
      /* THREE WIDE AND TWO DEEP, not six wide. Six columns draws at about
         1604 user units inside a 1282px frame, so the whole diagram scaled
         DOWN to fit and its labels rendered smaller than every other flow on
         the page — the one diagram where raising the font size achieves
         nothing, because width is what is binding. Wrapped, it draws at about
         764 units and scales UP, which roughly doubles the type.

         The reading order is unchanged: 01 to 06, left to right, then the
         line wraps the way a line of type does. See the connector note in
         AgentFlow.tsx. */
      nodes: [
        { id: "crawl", label: "Crawl the largest accounts' sites", kind: "auto", col: 0 },
        { id: "extract", label: "Extract products and pricing", kind: "auto", col: 1 },
        { id: "diff", label: "Diff against the previous run", kind: "auto", col: 2 },
        { id: "flag", label: "Competitor line added, pulled or repriced", kind: "flag", col: 0, row: 1 },
        { id: "read", label: "Interpret what it signals for us", kind: "auto", col: 1, row: 1 },
        { id: "brief", label: "Brief the people who can act", kind: "human", col: 2, row: 1 },
      ],
      edges: [
        { from: "crawl", to: "extract" },
        { from: "extract", to: "diff" },
        { from: "diff", to: "flag" },
        { from: "flag", to: "read" },
        { from: "read", to: "brief" },
      ],
    },
    stat: null,
    todo: [
      "ANSWER: how many accounts it watches, and how often it runs.",
      "ANSWER: where the interpretation lands. An email, a channel, a document?",
      "CHECK: whether anything about which accounts are monitored is sensitive. The copy is deliberately aggregate and names nobody, but confirm the shape of it is safe to publish at all.",
    ],
  },

  /* ---------------------------------------------------------------- 03 -- */
  {
    slug: "lead-gen",
    nav: "Lead Gen",
    title: "The lead generation agent",
    deck: "Researches and compiles prospective leads into something a salesperson can act on directly.",
    body: [
      "It researches potential leads and compiles what it finds into one brief per lead, so the work arriving on a salesperson's desk is already assembled instead of being a name and a homework assignment.",
      "The constraint is the billing agent's, pointed at a softer problem. Research is exactly where a model produces something confident and wrong. A lead brief with an invented fact in it is worse than no brief, because somebody will repeat it on a call. So the agent compiles and attributes. It does not conclude.",
    ],
    point:
      "The value is handing a person something finished. That only works if every line in it can be traced back to where it came from.",
    flow: {
      label:
        "The lead generation agent: source candidates, research each one, compile a single brief per lead, then hand it to sales",
      caption:
        "Four steps, and the last one is a person. What the agent produces is an input to somebody's day.",
      nodes: [
        { id: "source", label: "Source candidate leads", kind: "auto", col: 0 },
        { id: "research", label: "Research each one", kind: "auto", col: 1 },
        { id: "compile", label: "Compile a single brief per lead", kind: "auto", col: 2 },
        { id: "sales", label: "Sales acts on it", kind: "human", col: 3 },
      ],
      edges: [
        { from: "source", to: "research" },
        { from: "research", to: "compile" },
        { from: "compile", to: "sales" },
      ],
    },
    sample: {
      label: "A sample lead brief",
      data: {
        chrome: [
          { label: "Source", value: "public procurement notices" },
          { label: "Compiled", value: "overnight" },
          { label: "Owner", value: "territory rep" },
        ],
        title: "Regional district, science facilities refresh",
        rows: [
          {
            tag: "Signal",
            tone: "auto",
            title: "Bond measure passed including science facility work",
            body: "Public record, with the posted timeline attached. Suggests purchasing inside the next budget cycle rather than this one.",
          },
          {
            tag: "Signal",
            tone: "auto",
            title: "No existing supplier relationship on record",
            body: "Not in the account list. There is no incumbent to displace here, which changes the approach.",
          },
          {
            tag: "Action",
            tone: "human",
            title: "Route to the territory rep with the procurement contact",
            body: "The agent stops here. What to offer, and when, is not its call.",
          },
        ],
      },
    },
    stat: null,
    todo: [
      "ANSWER: what it actually researches. Which sources, which signals?",
      "ANSWER: where the output lands. A sheet, a CRM, an inbox?",
      "ANSWER: who consumes it, and whether they act on it directly.",
      "WRITE: the sample lead card above is a reasonable guess at the shape of the artefact and it should be replaced with the real shape once the three answers above exist.",
    ],
  },

  /* ---------------------------------------------------------------- 04 -- */
  {
    slug: "daily-brief",
    nav: "Daily Brief",
    title: "The daily brief agent",
    deck: "A morning email on what moved in AI, filtered to what would change how I work.",
    body: [
      "It reads the day's developments in AI and sends me one email about the ones relevant to what I am building. Relevance is the entire feature. An unfiltered digest of AI news is a way to spend twenty minutes learning nothing, and that is why nobody keeps reading one.",
      "It carries one standing watch beyond my own work: AI in the education sector. American Scientific sells to schools and districts, so what those buyers are being told about AI, and what their procurement frameworks are starting to permit, is commercially useful to us well before it is obvious.",
    ],
    point:
      "This is the smallest of the four and the one I would defend longest. An agent whose job is to decide what is not worth telling me is running the billing agent's fork on a smaller scale.",
    flow: {
      label:
        "The daily brief agent: scan the day's AI developments, filter to relevance against my work and the education sector, assess what each one changes, then email one brief",
      caption:
        "Two of the four steps are discarding things.",
      nodes: [
        { id: "scan", label: "Scan the day's AI developments", kind: "auto", col: 0 },
        { id: "filter", label: "Filter to my work and to education", kind: "auto", col: 1 },
        { id: "assess", label: "Assess what each one changes", kind: "auto", col: 2 },
        { id: "email", label: "One email, every morning", kind: "human", col: 3 },
      ],
      edges: [
        { from: "scan", to: "filter" },
        { from: "filter", to: "assess" },
        { from: "assess", to: "email" },
      ],
    },
    sample: {
      label: "A sample daily brief email",
      data: {
        chrome: [
          { label: "Subject", value: "Daily brief: two things worth your time" },
          { label: "Sent", value: "06:00, daily" },
          { label: "Filtered", value: "everything else, with reasons" },
        ],
        title: "Two things that change something",
        rows: [
          {
            tag: "Education",
            tone: "auto",
            title: "A state procurement framework added AI tooling to its approved categories",
            body: "Matters because our buyers are districts, and a procurement category is the mechanism by which a budget line becomes spendable.",
          },
          {
            tag: "Tooling",
            tone: "auto",
            title: "A provider shipped guaranteed structured output",
            body: "Would let the billing agent drop a validation layer between the model and the NetSuite call. Worth an afternoon to test.",
          },
        ],
        footer:
          "Everything else from the day was filtered out, each with the reason it was dropped, in case the filter is wrong.",
      },
    },
    stat: null,
    todo: [],
  },
];
