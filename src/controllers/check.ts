import { $ } from "bun";
import { checkDNSBL, dnsblList, isValidIP } from "../services/dnsbl";

const check = async (url: URL, path: string, headers: any) => {
  const ip = url.searchParams.get("ip");

  if (!ip) {
    return new Response(JSON.stringify({ error: "IP parameter is required" }), {
      status: 400,
      headers,
    });
  }

  if (!isValidIP(ip)) {
    return new Response(
      JSON.stringify({ error: "Invalid IP address format" }),
      { status: 400, headers }
    );
  }

  try {
    let hostname = "";
    try {
      hostname = (await $`host ${ip}`.text()).trim();
    } catch {
      hostname = "Not found";
    }

    const checks = await Promise.all(
      dnsblList.map((dnsbl) => checkDNSBL(ip, dnsbl))
    );

    const response = {
      ip,
      hostname,
      timestamp: new Date().toISOString(),
      results: checks,
      summary: {
        total: checks.length,
        listed: checks.filter((check) => check.isListed).length,
        clean: checks.filter((check) => !check.isListed).length,
      },
    };

    return new Response(JSON.stringify(response, null, 2), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export default check;
