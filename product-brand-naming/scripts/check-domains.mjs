#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const args = process.argv.slice(2);

function usage() {
  console.error(`Usage:
  node check-domains.mjs NameOne NameTwo --tlds=com,io,app
  node check-domains.mjs consentprobe.com consentradar.io --json

Options:
  --tlds=com,io,app   TLDs to append when inputs are not full domains
  --json              Output JSON instead of a markdown table
  --timeout-ms=4500   Per RDAP request timeout
`);
}

let tlds = ["com", "io", "app"];
let json = false;
let timeoutMs = 4500;
const inputs = [];

for (const arg of args) {
  if (arg === "--help" || arg === "-h") {
    usage();
    process.exit(0);
  } else if (arg === "--json") {
    json = true;
  } else if (arg.startsWith("--tlds=")) {
    tlds = arg.slice("--tlds=".length).split(",").map((value) => value.trim()).filter(Boolean);
  } else if (arg.startsWith("--timeout-ms=")) {
    timeoutMs = Number(arg.slice("--timeout-ms=".length));
  } else {
    inputs.push(arg);
  }
}

if (inputs.length === 0) {
  usage();
  process.exit(1);
}

function normalizeName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
}

function expandDomains(values) {
  const domains = [];
  for (const raw of values) {
    const name = normalizeName(raw);
    if (!name) continue;
    if (name.includes(".")) {
      domains.push(name);
    } else {
      for (const tld of tlds) domains.push(`${name}.${tld}`);
    }
  }
  return [...new Set(domains)];
}

async function rdap(domain) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: controller.signal,
      headers: { accept: "application/rdap+json, application/json" },
    });
    clearTimeout(timer);

    if (response.status === 404) return { signal: "rdap_404", status: "likely_available" };
    if (response.status === 200) return { signal: "rdap_200", status: "registered" };
    if (response.status === 429) return { signal: "rdap_429", status: "unknown" };
    return { signal: `rdap_${response.status}`, status: "unknown" };
  } catch (error) {
    clearTimeout(timer);
    return { signal: `rdap_error:${error.name || "error"}`, status: "unknown" };
  }
}

async function whoisFallback(domain) {
  try {
    const { stdout } = await execFileAsync("whois", [domain], { timeout: timeoutMs + 1000 });
    const text = stdout.toLowerCase();
    const noMatch = [
      "no match",
      "not found",
      "domain not found",
      "no data found",
      "object does not exist",
    ].some((needle) => text.includes(needle));
    if (noMatch) return { signal: "whois_no_match", status: "likely_available" };

    const registered = ["creation date", "registrar:", "registry domain id"].some((needle) =>
      text.includes(needle),
    );
    if (registered) return { signal: "whois_registered", status: "registered" };

    return { signal: "whois_unclear", status: "unknown" };
  } catch (error) {
    return { signal: `whois_error:${error.code || error.name || "error"}`, status: "unknown" };
  }
}

async function check(domain) {
  const first = await rdap(domain);
  if (first.status !== "unknown") return { domain, ...first };

  const second = await whoisFallback(domain);
  return {
    domain,
    status: second.status,
    signal: `${first.signal};${second.signal}`,
  };
}

const domains = expandDomains(inputs);
const results = [];

for (const domain of domains) {
  results.push(await check(domain));
}

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log("| Domain | Status | Signal |");
  console.log("| --- | --- | --- |");
  for (const result of results) {
    console.log(`| ${result.domain} | ${result.status} | ${result.signal} |`);
  }
}
