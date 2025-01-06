import {
  checkDNSBL,
  dnsblList,
  generateIPsInPrefix,
  isValidIP,
  isValidPrefix,
} from "../services/dnsbl";
import type { UnblockInfo } from "../services/unblockInfo";

const checkPrefix = async (url: URL, path: string, headers: any) => {
  const baseIP = url.searchParams.get("ip");
  const prefix = parseInt(url.searchParams.get("prefix") || "");
  const maxIPs = parseInt(url.searchParams.get("limit") || "256");
  
  // Validasi input
  if (!baseIP || isNaN(prefix)) {
    return new Response(
      JSON.stringify({ error: "IP and prefix parameters are required" }),
      { status: 400, headers }
    );
  }

  if (!isValidIP(baseIP)) {
    return new Response(
      JSON.stringify({ error: "Invalid IP address format" }),
      { status: 400, headers }
    );
  }

  if (!isValidPrefix(prefix)) {
    return new Response(
      JSON.stringify({
        error: "Invalid prefix (must be between 24 and 32)",
      }),
      { status: 400, headers }
    );
  }

  try {
    const startTime = Date.now();
    const results: Array<{
      ip: string;
      timestamp: string;
      results: Array<{
        dnsbl: string;
        isListed: boolean;
        info?: string;
        unblockInfo?: UnblockInfo;
      }>;
      summary: {
        total: number;
        listed: number;
        clean: number;
      };
    }> = [];

    const ipGenerator = generateIPsInPrefix(baseIP, prefix);
    let count = 0;
    let processedCount = 0;

    const batchSize = 10;
    const processBatch = async (ips: string[]) => {
      const batchChecks = await Promise.all(
        ips.map(async (ip) => {
          const checks = await Promise.all(
            dnsblList.map((dnsbl) => checkDNSBL(ip, dnsbl))
          );
          return { ip, checks };
        })
      );

      for (const { ip, checks } of batchChecks) {
        if (checks.some((check) => check.isListed)) {
          results.push({
            ip,
            timestamp: new Date().toISOString(),
            results: checks,
            summary: {
              total: checks.length,
              listed: checks.filter((check) => check.isListed).length,
              clean: checks.filter((check) => !check.isListed).length,
            },
          });
        }
      }
    };

    // Process IPs in batches
    let currentBatch: string[] = [];
    for (const ip of ipGenerator) {
      if (count >= maxIPs) break;

      currentBatch.push(ip);
      count++;

      if (currentBatch.length === batchSize || count === maxIPs) {
        await processBatch(currentBatch);
        processedCount += currentBatch.length;

        const progress = Math.round((processedCount / count) * 100);
        console.log(
          `Progress: ${progress}% (${processedCount}/${count} IPs checked)`
        );

        currentBatch = [];
      }
    }

    if (currentBatch.length > 0) {
      await processBatch(currentBatch);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // ini detik ya

    const response = {
      prefix: `${baseIP}/${prefix}`,
      timestamp: new Date().toISOString(),
      scanDuration: `${duration.toFixed(2)} seconds`,
      totalChecked: count,
      listedIPs: results,
      summary: {
        totalIPs: count,
        listedCount: results.length,
        cleanCount: count - results.length,
        percentageListed: ((results.length / count) * 100).toFixed(2) + "%",
      },
      performance: {
        averageTimePerIP: (duration / count).toFixed(2) + " seconds",
        ipsPerSecond: (count / duration).toFixed(2),
      },
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        ...headers,
        "X-Processing-Time": `${duration.toFixed(2)}s`,
        "X-Total-IPs": count.toString(),
        "X-Listed-IPs": results.length.toString(),
      },
    });
  } catch (error) {
    console.error("Prefix check error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};

export default checkPrefix;
