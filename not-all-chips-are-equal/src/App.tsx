/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Activity, Cpu, Database, Globe, Layers, Lock, type LucideIcon, Zap } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

type MessageRole = "ai" | "user" | "fact";

type Message = {
  id: string;
  role: MessageRole;
  text: string;
};

type Question = {
  prompt: string;
  options: string[];
  correctIndex: number;
  fact: string;
};

type ChipCardProps = {
  accent: string;
  icon: LucideIcon;
  points: string[];
  title: string;
};

type MetricCardProps = {
  detail: string;
  label: string;
  value: string;
};

const quizQuestions: Question[] = [
  {
    prompt: "When an AI model like ChatGPT answers you, where does the actual computing happen?",
    options: [
      "On my device (phone or laptop)",
      "In data centers full of specialized chips",
      "On satellites",
      "Distributed evenly across the internet",
    ],
    correctIndex: 1,
    fact: "It all happens in massive data centers. The chips inside those racks are doing billions of math operations per second just to predict the next word in a sentence. Your device just displays the result.",
  },
  {
    prompt: "A GPU was originally invented for what purpose?",
    options: [
      "Running AI models",
      "Rendering video game graphics",
      "Powering smartphones",
      "Encrypting internet traffic",
    ],
    correctIndex: 1,
    fact: "GPUs were built in the 1990s to make video games look good. It turned out the math for rendering pixels — millions of small operations done simultaneously — is almost identical to the math AI needs. Nobody planned it that way.",
  },
  {
    prompt: "Google built its own AI chip called a TPU. Why not just use GPUs like everyone else?",
    options: [
      "GPUs are too expensive to manufacture",
      "TPUs are purpose-built for AI math, making them faster and more efficient for that specific job",
      "Google couldn't acquire enough GPUs",
      "TPUs perform better in Google's underwater data centers",
    ],
    correctIndex: 1,
    fact: "A TPU (tensor processing unit) is designed from scratch for one thing: AI math called tensor operations. By removing everything else a general chip needs to do, Google gets hardware that's measurably faster and uses less energy — but only for AI.",
  },
  {
    prompt: "A single high-end NVIDIA H100 GPU — the chip most frontier AI labs depend on — costs roughly how much?",
    options: ["Around $500", "Around $3,000", "Around $30,000", "Around $300,000"],
    correctIndex: 2,
    fact: "One H100 costs $25,000–$40,000. Training a frontier model requires thousands of them, running for weeks. That puts the hardware bill in the hundreds of millions — a barrier only a handful of companies on the planet can clear.",
  },
  {
    prompt: "An FPGA is a chip that can be reprogrammed after manufacture. What's the main appeal for AI use?",
    options: [
      "It's the fastest chip available",
      "It can be tuned for specific tasks, often using far less energy than a GPU",
      "It's the cheapest option on the market",
      "It doesn't require cooling systems",
    ],
    correctIndex: 1,
    fact: "FPGAs aren't the fastest, but their reprogrammability means you can strip out everything your task doesn't need — which can dramatically cut power consumption. The catch: programming them requires expertise most teams don't have, which limits who can actually use them.",
  },
  {
    prompt: "Researchers estimated that training one large AI model can emit CO₂ comparable to what?",
    options: [
      "Charging a smartphone 10,000 times",
      "Five transatlantic round-trip flights",
      "Running an entire city for a year",
      "Powering a laptop for a decade",
    ],
    correctIndex: 1,
    fact: "Strubell et al. estimated the carbon cost of training a large NLP model at roughly five transatlantic round trips. The number varies enormously by model size and hardware efficiency — which is exactly why the choice between GPU, TPU, and FPGA has real environmental stakes, not just financial ones.",
  },
  {
    prompt: "True or false: universities and public research labs have roughly equal access to cutting-edge AI hardware compared to large tech companies.",
    options: [
      "True — cloud computing has leveled the playing field",
      "False — the cost and scarcity gap is enormous",
      "It depends on the country",
      "I'm not sure",
    ],
    correctIndex: 1,
    fact: "The AI Now Institute and other researchers consistently document a stark divide. Large tech companies own or lease tens of thousands of the most powerful chips. Universities often depend on limited grant programs or shared cloud credits — a fundamentally different tier of access that shapes who gets to do frontier AI research, and who doesn't.",
  },
];

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createMessage(role: MessageRole, text: string): Message {
  return {
    id: `${role}-${makeId()}`,
    role,
    text,
  };
}

function readUserName() {
  if (typeof window === "undefined") {
    return "researcher";
  }

  const rawName = (window as Window & { userName?: unknown }).userName;
  if (typeof rawName !== "string") {
    return "researcher";
  }

  const trimmed = rawName.trim();
  return trimmed.length > 0 ? trimmed : "researcher";
}

function getWelcomeMessage(userName: string) {
  return `Welcome, ${userName}. Before we get into the paper, I want to see what you already know — and fill in what you don't. 7 questions. No wrong answers, just honest ones.`;
}

function getConclusionMessage(score: number, userName: string) {
  if (score >= 6) {
    return `You already knew most of this, ${userName}. That's rare — most people outside the field haven't thought about the infrastructure behind AI. The paper will add nuance to what you already understand.`;
  }

  if (score >= 3) {
    return `Good instincts, with some real surprises in there, ${userName}. You came in with a mental model of how AI works — some of it accurate, some shaped by how AI gets discussed publicly, which tends to skip the hardware entirely. That gap is what the paper is about.`;
  }

  return `Almost nobody starts out knowing this, ${userName}. The distance between how AI gets talked about publicly and how it actually works — physically, energetically, economically — is enormous. That distance is exactly what this research is about.`;
}

const closingLine =
  "The chips running AI aren't neutral infrastructure. They determine who gets to build it, what it costs the planet, and whether the benefits concentrate in a few companies or spread broadly. GPUs, TPUs, and FPGAs each make a different bet on that trade-off — and that's a political question as much as a technical one.";

const SectionHeading = ({
  children,
  kicker,
}: {
  children: ReactNode;
  kicker?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="space-y-3"
  >
    {kicker ? <p className="text-sm tracking-[0.2em] text-teal/80">{kicker}</p> : null}
    <h2 className="font-display text-4xl leading-none tracking-tight text-text md:text-6xl">{children}</h2>
  </motion.div>
);

const MessageBubble = ({ role, text }: { role: MessageRole; text: string }) => {
  const isUser = role === "user";
  const isFact = role === "fact";

  const wrapperClass = isUser ? "justify-end" : "justify-start";
  const bubbleClass = isUser
    ? "bg-chat-user border-chat-user-border text-white rounded-[28px] rounded-br-lg"
    : isFact
      ? "bg-chat-fact border-chat-fact-border text-[#D9F2FF] rounded-[24px] rounded-bl-lg"
      : "bg-[#202734] border-border text-text rounded-[28px] rounded-bl-lg";

  const label = isUser ? "You" : isFact ? "Fact" : "AI";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`flex ${wrapperClass}`}
    >
      <div className={`max-w-[88%] border px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:max-w-[76%] ${bubbleClass}`}>
        <div className="mb-1 text-[11px] tracking-[0.18em] text-white/55">{label}</div>
        <p className={`${isFact ? "text-sm md:text-[15px]" : "text-[15px] md:text-base"} leading-relaxed`}>{text}</p>
      </div>
    </motion.div>
  );
};

const ChipCard = ({ accent, icon: Icon, points, title }: ChipCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-8 shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
  >
    <div
      aria-hidden
      className="absolute -right-14 top-0 h-32 w-32 rounded-full blur-3xl"
      style={{ backgroundColor: `${accent}22` }}
    />
    <div className="relative space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-sm tracking-[0.18em] text-white/45">Chip family</div>
          <h3 className="font-display text-3xl leading-none tracking-tight text-text md:text-4xl">{title}</h3>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{ borderColor: `${accent}66`, color: accent, backgroundColor: `${accent}15` }}
        >
          <Icon size={28} strokeWidth={1.8} />
        </div>
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted">
        {points.map((point) => (
          <div key={point} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <p>{point}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const MetricCard = ({ detail, label, value }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="rounded-[26px] border border-border bg-surface p-6 shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
  >
    <div className="mb-3 text-4xl font-semibold tracking-tight text-text md:text-5xl">{value}</div>
    <div className="mb-2 text-sm text-white/65">{label}</div>
    <p className="text-sm leading-relaxed text-muted">{detail}</p>
  </motion.div>
);

export default function App() {
  const userName = readUserName();
  const paperRef = useRef<HTMLElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const [messages, setMessages] = useState<Message[]>(() => [createMessage("ai", getWelcomeMessage(userName))]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isAwaitingAnswer, setIsAwaitingAnswer] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);

  const currentQuestion = currentQuestionIndex === null ? null : quizQuestions[currentQuestionIndex];

  useEffect(() => {
    const schedule = (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(callback, delay);
      timeoutsRef.current.push(timeoutId);
    };

    schedule(() => {
      setMessages((previous) => [...previous, createMessage("ai", quizQuestions[0].prompt)]);
      setCurrentQuestionIndex(0);
      setIsAwaitingAnswer(true);
    }, 1200);

    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, showConclusion]);

  const schedule = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
  };

  const scrollToPaper = () => {
    paperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion || !isAwaitingAnswer || currentQuestionIndex === null) {
      return;
    }

    const questionIndex = currentQuestionIndex;
    const selectedOption = currentQuestion.options[optionIndex];

    setIsAwaitingAnswer(false);
    setAnsweredCount((previous) => previous + 1);
    setMessages((previous) => [...previous, createMessage("user", selectedOption)]);

    if (optionIndex === currentQuestion.correctIndex) {
      setScore((previous) => previous + 1);
    }

    schedule(() => {
      setMessages((previous) => [...previous, createMessage("fact", currentQuestion.fact)]);
    }, 700);

    if (questionIndex === quizQuestions.length - 1) {
      setCurrentQuestionIndex(null);
      schedule(() => setShowConclusion(true), 1600);
      return;
    }

    schedule(() => {
      const nextQuestionIndex = questionIndex + 1;
      setMessages((previous) => [...previous, createMessage("ai", quizQuestions[nextQuestionIndex].prompt)]);
      setCurrentQuestionIndex(nextQuestionIndex);
      setIsAwaitingAnswer(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-teal/30">
      <section className="relative overflow-hidden px-6 py-8 md:px-8 md:py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,201,167,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.16),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-[32px] border border-border bg-panel/90 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="h-1.5 bg-white/6">
              <motion.div
                animate={{ width: `${(answeredCount / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full bg-[linear-gradient(90deg,#00C9A7_0%,#60A5FA_100%)]"
              />
            </div>

            <div className="flex min-h-[620px] flex-col md:min-h-[700px]">
              <div aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
                {messages.map((message) => (
                  <MessageBubble key={message.id} role={message.role} text={message.text} />
                ))}

                {showConclusion ? (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="rounded-[30px] border border-chat-fact-border bg-[linear-gradient(135deg,rgba(17,50,77,0.96),rgba(10,22,36,0.96))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-8"
                  >
                    <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/80">
                      Score {score}/7
                    </div>
                    <p className="max-w-3xl text-lg leading-relaxed text-[#E7F6FF] md:text-xl">
                      {getConclusionMessage(score, userName)}
                    </p>
                    <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#B7D7EA]">{closingLine}</p>
                    <button
                      type="button"
                      onClick={scrollToPaper}
                      className="mt-8 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      Read the full paper →
                    </button>
                  </motion.div>
                ) : null}

                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-border/80 bg-bg/40 px-4 py-4 backdrop-blur-sm md:px-8 md:py-6">
                {currentQuestion && isAwaitingAnswer ? (
                  <div className="grid gap-3">
                    {currentQuestion.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleAnswer(optionIndex)}
                        className="rounded-[22px] border border-border bg-surface px-4 py-3 text-left text-[15px] leading-relaxed text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-chat-user-border hover:bg-[#1B2637]"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-14 items-center text-sm text-muted">
                    {showConclusion ? "The paper continues below." : " "}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <article ref={paperRef} id="paper" className="relative overflow-hidden border-t border-border/80 bg-[#0B0F15] px-6 py-20 md:px-8 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,201,167,0.1),transparent_30%),linear-gradient(180deg,rgba(11,15,21,0)_0%,rgba(11,15,21,1)_100%)]" />

        <div className="relative mx-auto max-w-7xl space-y-24">
          <section className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <div className="space-y-8">
              <SectionHeading kicker="The paper">Not all chips are equal</SectionHeading>
              <p className="max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
                AI feels abstract because most people only encounter it as an interface. The paper argues that the real politics
                of AI begin much earlier, at the level of hardware: which chips exist, who can afford them, and how much
                electricity their design choices consume.
              </p>
              <blockquote className="border-l-2 border-teal pl-6 text-2xl leading-tight text-text md:text-3xl">
                “The chip you use determines the cost you pay — in watts, in dollars, and in access.”
              </blockquote>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-[30px] border border-border bg-surface p-8 shadow-[0_22px_65px_rgba(0,0,0,0.28)]"
            >
              <div className="mb-3 text-sm tracking-[0.18em] text-teal/75">Research questions</div>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted">
                <p>How much does hardware architecture change the energy cost of AI training and inference?</p>
                <p>Does access to more efficient hardware create a new divide between large technology firms and everyone else?</p>
                <p>If efficiency is locked behind proprietary infrastructure, who bears the environmental cost of the alternatives?</p>
              </div>
            </motion.div>
          </section>

          <section className="space-y-10">
            <SectionHeading kicker="Three hardware paths">What GPU, TPU, and FPGA each optimize for</SectionHeading>
            <div className="grid gap-8 lg:grid-cols-3">
              <ChipCard
                accent="#00C9A7"
                icon={Layers}
                title="GPU"
                points={[
                  "The general-purpose workhorse of contemporary AI, prized because researchers can train, fine-tune, and deploy many different models on the same platform.",
                  "That flexibility comes at a cost: more power draw, more heat, and far higher spending once workloads scale into the thousands of chips.",
                  "Because the software ecosystem is mature, GPUs often become the default even when they are not the most efficient choice.",
                ]}
              />
              <ChipCard
                accent="#F59E0B"
                icon={Cpu}
                title="TPU"
                points={[
                  "A TPU is purpose-built for tensor operations, the matrix math that dominates modern neural networks.",
                  "By removing functions a general chip needs, TPUs can perform the same AI work with materially better efficiency.",
                  "That gain is real, but access is concentrated: the most advanced TPUs are tied to Google's infrastructure and pricing.",
                ]}
              />
              <ChipCard
                accent="#60A5FA"
                icon={Activity}
                title="FPGA"
                points={[
                  "An FPGA can be reprogrammed after manufacture, which means teams can tailor the chip to one specific workload instead of living with a one-size-fits-all design.",
                  "That specialization can reduce waste and power draw dramatically, especially for inference or edge deployments.",
                  "The trade-off is skill: programming FPGAs is difficult, which means their theoretical openness does not automatically translate into broad usability.",
                ]}
              />
            </div>
          </section>

          <section className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-8">
              <SectionHeading kicker="Efficiency changes the stakes">The same model can have very different physical costs</SectionHeading>
              <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
                Hardware efficiency is often summarized as operations per watt. In plain terms, it asks how much useful AI math a
                chip can do for each unit of electricity. The ratios below are illustrative rather than universal, but they show
                the structure of the problem clearly: better hardware does not just save money, it changes environmental outcomes.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-[30px] border border-border bg-surface p-8 shadow-[0_22px_65px_rgba(0,0,0,0.24)]"
            >
              <div className="space-y-7">
                {[
                  {
                    accent: "#00C9A7",
                    detail: "Flexible, familiar, and still the default in most labs.",
                    label: "GPU standard",
                    value: "1.0x",
                    width: "24%",
                  },
                  {
                    accent: "#60A5FA",
                    detail: "Can be tuned tightly to a workload, especially for specialized inference.",
                    label: "FPGA specialized",
                    value: "4.2x",
                    width: "56%",
                  },
                  {
                    accent: "#F59E0B",
                    detail: "Purpose-built AI silicon can deliver major gains when the workload matches the design.",
                    label: "TPU optimized",
                    value: "10.0x",
                    width: "100%",
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-2">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-sm text-text">{row.label}</div>
                        <div className="text-sm text-muted">{row.detail}</div>
                      </div>
                      <div className="text-lg font-medium text-text" style={{ color: row.accent }}>
                        {row.value}
                      </div>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-bg/85">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: row.width }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: row.accent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          <section className="space-y-10">
            <SectionHeading kicker="Access is unequal">The most efficient hardware is also the hardest to reach</SectionHeading>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                <MetricCard
                  value="$25k–$40k"
                  label="Approximate cost of one NVIDIA H100"
                  detail="A frontier training run can require thousands of these chips at once, not one or two."
                />
                <MetricCard
                  value="Proprietary"
                  label="Status of Google TPU access"
                  detail="The most capable TPU generations are not something a university can simply buy and own."
                />
                <MetricCard
                  value="Weeks"
                  label="Typical frontier training window"
                  detail="The longer the run, the more cooling, electricity, and scheduling power matter."
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-[30px] border border-border bg-surface p-8 shadow-[0_22px_65px_rgba(0,0,0,0.24)]"
              >
                <div className="mb-8 flex items-center gap-3 text-white">
                  <Lock size={18} className="text-[#F87171]" />
                  <div className="text-lg">The access ladder</div>
                </div>
                <div className="space-y-5">
                  {[
                    { icon: Globe, label: "Big tech", status: "Owns or leases the largest clusters" },
                    { icon: Database, label: "Cloud providers", status: "Resells access, usually at enterprise prices" },
                    { icon: Layers, label: "Universities", status: "Often limited to grants, credits, or shared queues" },
                    { icon: Activity, label: "Startups", status: "Can rent hardware, but rarely at frontier scale" },
                    { icon: Cpu, label: "Independent researchers", status: "Typically priced out of state-of-the-art compute", locked: true },
                  ].map((item) => (
                    <div key={item.label} className="grid gap-4 rounded-[22px] border border-border bg-bg/65 px-4 py-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                          item.locked ? "border-[#F87171]/40 text-[#F87171]" : "border-teal/35 text-teal"
                        }`}
                      >
                        <item.icon size={18} />
                      </div>
                      <div>
                        <div className="text-text">{item.label}</div>
                        <div className="text-sm text-muted">{item.status}</div>
                      </div>
                      {item.locked ? <Lock size={16} className="text-[#F87171]" /> : null}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="space-y-8">
              <SectionHeading kicker="The political argument">These chips decide more than performance</SectionHeading>
              <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                Once hardware is treated as infrastructure instead of background detail, the paper's central claim becomes hard to
                avoid. Chip design determines the carbon footprint of AI systems, but it also determines who can participate in the
                field at the highest level. Efficiency concentrated inside a few firms can make AI cleaner for them while leaving
                everyone else with dirtier, slower, more expensive alternatives.
              </p>
              <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                That is why the GPU versus TPU versus FPGA question is never only technical. It is also a question about ownership,
                public research capacity, infrastructure spending, and whether the gains from AI remain enclosed inside a handful of
                private platforms.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-[30px] border border-teal/30 bg-[linear-gradient(180deg,rgba(0,201,167,0.08),rgba(13,17,23,0.96))] p-8 shadow-[0_22px_65px_rgba(0,0,0,0.24)]"
            >
              <div className="mb-5 flex items-center gap-3 text-teal">
                <Zap size={20} />
                <div className="text-lg text-text">What the paper insists on</div>
              </div>
              <div className="space-y-4 text-[15px] leading-relaxed text-[#C7D4DF]">
                <p>AI hardware is not neutral infrastructure.</p>
                <p>Efficiency can reduce emissions, but only if access to efficient chips is not artificially narrow.</p>
                <p>Public compute capacity matters because who owns the fastest hardware shapes who gets to ask the next big questions.</p>
              </div>
            </motion.div>
          </section>

          <footer className="border-t border-border pt-10">
            <SectionHeading kicker="Sources">Selected references</SectionHeading>
            <div className="mt-8 grid gap-8 text-sm leading-relaxed text-muted md:grid-cols-2">
              <ul className="space-y-4">
                <li>Patterson, David, et al. “Carbon Emissions and Large Neural Network Training.” arXiv, 2021.</li>
                <li>Jouppi, Norman P., et al. “In-datacenter performance analysis of a tensor processing unit.” ISCA, 2017.</li>
                <li>Strubell, Emma, et al. “Energy and Policy Considerations for Deep Learning in NLP.” ACL, 2019.</li>
              </ul>
              <ul className="space-y-4">
                <li>Bender, Emily M., et al. “On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?” FAccT, 2021.</li>
                <li>Schwartz, Roy, et al. “Green AI.” Communications of the ACM, 2020.</li>
                <li>Luccioni, Alexandra Sasha, et al. “Estimating the Carbon Footprint of BLOOM, a 176B Parameter Language Model.” arXiv, 2022.</li>
              </ul>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
