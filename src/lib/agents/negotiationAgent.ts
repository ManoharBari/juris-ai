// Agent: Simulates negotiation between both parties

const OpenAI = require("openai");
import { RiskedClause } from "./orchestrator";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type PartyArchetype =
  | "aggressive_corporate"
  | "small_landlord"
  | "mnc_standard"
  | "cooperative_employer"
  | "bank_loan_officer";

export interface NegotiationTurn {
  party: "user" | "counterparty";
  message: string;
  proposedText?: string;
}

export interface NegotiationResult {
  clause: RiskedClause;
  turns: NegotiationTurn[];
  finalAgreedText: string;
  wasResolved: boolean;
  userGain: string; // what the user won
}

const ARCHETYPE_PERSONAS: Record<PartyArchetype, string> = {
  aggressive_corporate:
    "You are an aggressive corporate legal team. You push back hard on every change. You use intimidation tactics like 'this is standard' and 'take it or leave it'. You only concede if user makes strong legal arguments.",
  small_landlord:
    "You are a small-town landlord who follows custom and tradition, not law. You are suspicious of legal language. You respond emotionally. You might agree if the argument is fair and simple.",
  mnc_standard:
    "You represent an MNC with templated contracts. You say 'our legal team has approved this' often. You are polite but firm. You concede only on non-core clauses.",
  cooperative_employer:
    "You are a small business owner who genuinely wants a fair deal. You are open to negotiation but worry about your own interests too.",
  bank_loan_officer:
    "You are a bank officer bound by RBI guidelines. You are formal and cite internal policy. You can concede on timeline but not on core terms.",
};

export async function negotiateClause(
  clause: RiskedClause,
  archetype: PartyArchetype,
  maxRounds: number = 3,
): Promise<NegotiationResult> {
  const turns: NegotiationTurn[] = [];
  let currentClauseText = clause.originalText;
  let wasResolved = false;
  let finalAgreedText = clause.originalText;
  let userGain = "No change achieved";

  const conversationHistory: { role: "user" | "assistant"; content: string }[] =
    [];

  // Opening: User's agent proposes the redlined edit
  const userOpeningMove = `I want to modify this clause: "${clause.originalText}"
  
My proposed revision: "${clause.redlinedEdit}"

Reason: ${clause.explanation}. This is supported by ${clause.legalCitation}.`;

  turns.push({
    party: "user",
    message: userOpeningMove,
    proposedText: clause.redlinedEdit,
  });
  conversationHistory.push({ role: "user", content: userOpeningMove });

  for (let round = 0; round < maxRounds; round++) {
    // Counterparty responds
    const counterResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${ARCHETYPE_PERSONAS[archetype]}
          
You are negotiating a contract clause. 
If you agree, start your response with "AGREED:" and provide the final text.
If you counter-propose, start with "COUNTER:" and provide alternative text.
If you refuse, start with "REFUSED:" and explain why.
Keep responses short - 2-3 sentences max.`,
        },
        ...conversationHistory,
      ],
      temperature: 0.7,
    });

    const counterMessage = counterResponse.choices[0].message.content ?? "";
    conversationHistory.push({ role: "assistant", content: counterMessage });
    turns.push({ party: "counterparty", message: counterMessage });

    if (counterMessage.startsWith("AGREED:")) {
      wasResolved = true;
      finalAgreedText = clause.redlinedEdit;
      userGain = "Full revision accepted";
      break;
    }

    if (counterMessage.startsWith("COUNTER:")) {
      // User's agent evaluates the counter
      const userCounterEval = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal advocate for a common person in India. 
Evaluate if the counterparty's proposal is acceptable or push back further.
Prioritize user's protection. Be firm but reasonable.
If acceptable, start with "ACCEPT:" 
If pushing back, start with "PUSHBACK:" and give your counter.
Keep it to 2-3 sentences.`,
          },
          ...conversationHistory,
        ],
        temperature: 0.4,
      });

      const userReply = userCounterEval.choices[0].message.content ?? "";
      conversationHistory.push({ role: "user", content: userReply });
      turns.push({ party: "user", message: userReply });

      if (userReply.startsWith("ACCEPT:")) {
        wasResolved = true;
        // Extract the agreed text from counter
        finalAgreedText = counterMessage.replace("COUNTER:", "").trim();
        userGain = "Partial revision accepted — better than original";
        break;
      }
    }

    if (counterMessage.startsWith("REFUSED:")) {
      userGain =
        "Could not change this clause — consider rejecting the contract";
      break;
    }
  }

  return {
    clause,
    turns,
    finalAgreedText,
    wasResolved,
    userGain,
  };
}
