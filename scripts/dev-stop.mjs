#!/usr/bin/env node
/**
 * Stops the Next.js dev server for this repo (see .next/dev/lock).
 * Usage: npm run dev:stop
 */
import { execSync } from "node:child_process"
import { existsSync, readFileSync, unlinkSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const lockPath = join(root, ".next/dev/lock")
const defaultPort = process.env.PORT || "4000"

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

async function terminate(pid, label) {
  if (!pid || !isAlive(pid)) return false
  console.log(`Stopping ${label} (pid ${pid})...`)
  try {
    process.kill(pid, "SIGTERM")
  } catch {
    return false
  }
  for (let i = 0; i < 30; i++) {
    if (!isAlive(pid)) return true
    await sleep(100)
  }
  try {
    process.kill(pid, "SIGKILL")
  } catch {
    /* already gone */
  }
  return true
}

function pidsOnPort(port) {
  try {
    const out = execSync(`lsof -ti :${port} -sTCP:LISTEN`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    if (!out) return []
    return out
      .split("\n")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0)
  } catch {
    return []
  }
}

let port = defaultPort
let lockPid = null

if (existsSync(lockPath)) {
  try {
    const lock = JSON.parse(readFileSync(lockPath, "utf8"))
    if (lock.port) port = String(lock.port)
    if (lock.pid) lockPid = Number(lock.pid)
  } catch {
    /* ignore bad lock */
  }
}

let stopped = false

if (lockPid) {
  stopped = await terminate(lockPid, "dev server") || stopped
}

for (const pid of pidsOnPort(port)) {
  if (pid === lockPid) continue
  stopped = await terminate(pid, `listener on :${port}`) || stopped
}

if (existsSync(lockPath)) {
  try {
    unlinkSync(lockPath)
  } catch {
    /* ignore */
  }
}

if (stopped) {
  console.log(`Dev server on port ${port} stopped.`)
} else {
  console.log(`No dev server found on port ${port}.`)
}
