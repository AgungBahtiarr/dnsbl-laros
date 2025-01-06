interface UnblockInfo {
  provider: string;
  method: string;
  url?: string;
  email?: string;
  notes?: string;
}

const unblockInformation: Record<string, UnblockInfo> = {
  "all.s5h.net": {
    provider: "S5H.net",
    method: "Web Form",
    url: "http://all.s5h.net/removal.html",
    notes: "Automatic removal if spam stops",
  },
  "b.barracudacentral.org": {
    provider: "Barracuda",
    method: "Web Form",
    url: "https://www.barracudacentral.org/rbl/removal-request",
    notes: "Requires registration",
  },
  "bl.0spam.org": {
    provider: "0spam.org",
    method: "Automatic",
    notes: "Automatic removal within 24-48 hours if spam stops",
  },
  "bl.spamcop.net": {
    provider: "SpamCop",
    method: "Automatic",
    url: "https://www.spamcop.net/bl.shtml",
    notes: "Delisting occurs automatically within 24-48 hours",
  },
  "blacklist.woody.ch": {
    provider: "Woody's DNSBL",
    method: "Email",
    email: "removal@woody.ch",
    notes: "Include IP and reason for delisting",
  },
  "bogons.cymru.com": {
    provider: "Team Cymru",
    method: "Web Form",
    url: "https://team-cymru.com/community-services/bogon-reference/bogon-reference-removal/",
  },
  "combined.abuse.ch": {
    provider: "abuse.ch",
    method: "Web Form",
    url: "https://abuse.ch/lookup/",
  },
  "db.wpbl.info": {
    provider: "WPBL",
    method: "Web Form",
    url: "https://wpbl.info/",
    notes: "Auto-removal after 30 days",
  },
  "dnsbl-1.uceprotect.net": {
    provider: "UCEPROTECT Level 1",
    method: "Email",
    email: "remove@uceprotect.net",
    notes: "Include IP and detailed explanation",
  },
  "dnsbl-2.uceprotect.net": {
    provider: "UCEPROTECT Level 2",
    method: "Email",
    email: "remove@uceprotect.net",
    notes: "Class C removal request",
  },
  "dnsbl-3.uceprotect.net": {
    provider: "UCEPROTECT Level 3",
    method: "Email",
    email: "remove@uceprotect.net",
    notes: "ASN block removal request",
  },
  "dnsbl.dronebl.org": {
    provider: "DroneBL",
    method: "Web Form",
    url: "https://dronebl.org/lookup",
  },
  "drone.abuse.ch": {
    provider: "abuse.ch Drone",
    method: "Web Form",
    url: "https://abuse.ch/lookup/",
  },
  "dyna.spamrats.com": {
    provider: "SpamRats",
    method: "Web Form",
    url: "https://www.spamrats.com/removal.php",
  },
  "ips.backscatterer.org": {
    provider: "Backscatterer",
    method: "Web Form",
    url: "http://www.backscatterer.org/?target=test",
  },
  "ix.dnsbl.manitu.net": {
    provider: "Manitu",
    method: "Web Form",
    url: "https://www.dnsbl.manitu.net/index.php?language=en",
  },
  "noptr.spamrats.com": {
    provider: "SpamRats NOPTR",
    method: "Web Form",
    url: "https://www.spamrats.com/removal.php",
  },
  "psbl.surriel.com": {
    provider: "PSBL",
    method: "Automatic",
    url: "https://psbl.org/remove",
    notes: "Auto-removal after 2 weeks of no spam",
  },
  "spam.spamrats.com": {
    provider: "SpamRats",
    method: "Web Form",
    url: "https://www.spamrats.com/removal.php",
  },
  "spamrbl.imp.ch": {
    provider: "IMP SpamRBL",
    method: "Email",
    email: "spamrbl@imp.ch",
    notes: "Include IP and reason for delisting",
  },
  "ubl.unsubscore.com": {
    provider: "UnsubScore",
    method: "Web Form",
    url: "https://www.unsubscore.com/delist.php",
  },
  "z.mailspike.net": {
    provider: "MailSpike",
    method: "Web Form",
    url: "https://mailspike.net/removal.html",
  },
};

export { unblockInformation };
export type { UnblockInfo };
