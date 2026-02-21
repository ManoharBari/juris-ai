// app/api/negotiate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { negotiateClause, PartyArchetype } from "@/lib/agents/negotiationAgent";
import { RiskedClause } from "@/lib/agents/orchestrator";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clause, archetype } = body as {
      clause: RiskedClause;
      archetype: PartyArchetype;
    };

    if (!clause || !archetype) {
      return NextResponse.json(
        { error: "clause and archetype required" },
        { status: 400 },
      );
    }

    const result = await negotiateClause(clause, archetype);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
