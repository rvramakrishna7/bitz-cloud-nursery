import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "lib", "guestbookStore.json");

const INITIAL_DATA = {
  odometerCount: 1208,
  entries: [
    {
      id: "seed-1",
      name: "Barnaby the Owl",
      mood: "🌟 Starlight Wish",
      message:
        "Thank you Mochi for the silver cricket lullaby! The Clocktower Attic has never been cozier.",
      createdAt: "2026-10-17T17:20:00+05:30",
    },
    {
      id: "seed-2",
      name: "Pebble the Tortoise",
      mood: "🌧️ Cozy Raindrop",
      message:
        "The clover-scented mist kept my greenhouse warm all evening. Good luck in Baby's First Website!",
      createdAt: "2026-10-17T17:45:00+05:30",
    },
    {
      id: "seed-3",
      name: "Sai & The Sky Builders",
      mood: "🌈 Rainbow Spark",
      message:
        "Small ideas, brighter beginnings! Keep weaving those fluffy cumulus dreams, little Mochi!",
      createdAt: "2026-10-17T18:10:00+05:30",
    },
  ],
};

function readStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    // Fallback to initial data if file read fails
  }
  return INITIAL_DATA;
}

function writeStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // In read-only serverless environments, memory/client sync gracefully handles persistence
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bump = searchParams.get("bump") === "1";
  const store = readStore();

  if (bump) {
    store.odometerCount = (store.odometerCount || 1208) + 1;
    writeStore(store);
  }

  return NextResponse.json(store, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 40);
    const message = String(body.message || "").trim().slice(0, 220);
    const mood = String(body.mood || "🌟 Starlight Wish").trim().slice(0, 32);

    if (!name || !message) {
      return NextResponse.json(
        { error: "Please enter both your name and a cozy weather wish!" },
        { status: 400 }
      );
    }

    const store = readStore();
    const newEntry = {
      id: `wish-${Date.now()}`,
      name,
      mood,
      message,
      createdAt: new Date().toISOString(),
    };

    store.entries = [newEntry, ...(store.entries || [])].slice(0, 50);
    store.odometerCount = (store.odometerCount || 1208) + 1;
    writeStore(store);

    return NextResponse.json(
      { entry: newEntry, odometerCount: store.odometerCount },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Could not save wish right now, please try again!" },
      { status: 500 }
    );
  }
}
