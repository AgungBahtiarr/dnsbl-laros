import { $ } from "bun";
import { resolve } from "dns/promises";

import { unblockInformation } from "./unblockInfo";
import { type UnblockInfo } from "./unblockInfo";

const dnsblList = [
  "all.s5h.net",
  "b.barracudacentral.org",
  "bl.0spam.org",
  "bl.spamcop.net",
  "blacklist.woody.ch",
  "bogons.cymru.com",
  "combined.abuse.ch",
  "db.wpbl.info",
  "dnsbl-1.uceprotect.net",
  "dnsbl-2.uceprotect.net",
  "dnsbl-3.uceprotect.net",
  "dnsbl.dronebl.org",
  "drone.abuse.ch",
  "duinv.aupads.org",
  "dyna.spamrats.com",
  "ips.backscatterer.org",
  "ix.dnsbl.manitu.net",
  "korea.services.net",
  "noptr.spamrats.com",
  "orvedb.aupads.org",
  "proxy.bl.gweep.ca",
  "psbl.surriel.com",
  "rbl.0spam.org",
  "relays.bl.gweep.ca",
  "relays.nether.net",
  "singular.ttk.pte.hu",
  "spam.abuse.ch",
  "spam.dnsbl.anonmails.de",
  "spam.spamrats.com",
  "spambot.bls.digibase.ca",
  "spamrbl.imp.ch",
  "spamsources.fabel.dk",
  "ubl.lashback.com",
  "ubl.unsubscore.com",
  "virus.rbl.jp",
  "wormrbl.imp.ch",
  "z.mailspike.net",
];

function reverseIP(ip: string): string {
  return ip.split(".").reverse().join(".");
}

function* generateIPsInPrefix(
  baseIP: string,
  prefix: number
): Generator<string> {
  const parts = baseIP.split(".");
  const prefixParts = Math.floor(prefix / 8);
  const remainingBits = prefix % 8;

  const baseNum = parts.map((p) => parseInt(p));
  const maxHosts = Math.pow(2, 32 - prefix);

  for (let i = 0; i < maxHosts; i++) {
    let current = [...baseNum];
    let temp = i;

    for (let j = 3; j >= prefixParts; j--) {
      if (j === prefixParts && remainingBits > 0) {
        const mask = 256 - Math.pow(2, 8 - remainingBits);
        const base = current[j] & mask;
        current[j] = base + (temp % Math.pow(2, 8 - remainingBits));
      } else if (j > prefixParts) {
        current[j] = temp % 256;
      }
      temp = Math.floor(temp / 256);
    }

    yield current.join(".");
  }
}

async function checkDNSBL(
  ip: string,
  dnsbl: string
): Promise<{
  dnsbl: string;
  isListed: boolean;
  info?: string;
  unblockInfo?: UnblockInfo;
}> {
  const lookupAddress = `${reverseIP(ip)}.${dnsbl}`;
  try {
    await resolve(lookupAddress);

    try {
      const txtRecord = await $`dig +short txt ${lookupAddress}`.text();
      return {
        dnsbl,
        isListed: true,
        info: txtRecord.trim() || undefined,
        unblockInfo: unblockInformation[dnsbl],
      };
    } catch {
      return {
        dnsbl,
        isListed: true,
        unblockInfo: unblockInformation[dnsbl],
      };
    }
  } catch {
    return {
      dnsbl,
      isListed: false,
    };
  }
}

function isValidIP(ip: string): boolean {
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (!ipRegex.test(ip)) return false;

  const parts = ip.split(".");
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

function isValidPrefix(prefix: number): boolean {
  return prefix >= 24 && prefix <= 32;
}

export { checkDNSBL, dnsblList, generateIPsInPrefix, isValidIP, isValidPrefix };
