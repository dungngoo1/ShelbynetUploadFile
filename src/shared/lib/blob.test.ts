import { describe, expect, it } from "vitest";
import {
  buildBlobUrl,
  buildExplorerUrl,
  extractBlobNameSuffix,
  formatBytes,
  truncateAddress,
} from "@/shared/lib/blob";

describe("blob helpers", () => {
  it("keeps plain blob names unchanged", () => {
    expect(extractBlobNameSuffix("image.png")).toBe("image.png");
  });

  it("extracts suffix from a full blob key", () => {
    expect(
      extractBlobNameSuffix(
        "@c359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/1600x900_Den.png",
      ),
    ).toBe("1600x900_Den.png");
  });

  it("builds blob url from plain blob name", () => {
    expect(
      buildBlobUrl(
        "0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6",
        "1600x900_Den.png",
      ),
    ).toBe(
      "https://api.shelbynet.shelby.xyz/shelby/v1/blobs/0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/1600x900_Den.png",
    );
  });

  it("builds blob url from full blob key using suffix", () => {
    expect(
      buildBlobUrl(
        "0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6",
        "@c359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/1600x900_Den.png",
      ),
    ).toBe(
      "https://api.shelbynet.shelby.xyz/shelby/v1/blobs/0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/1600x900_Den.png",
    );
  });

  it("builds explorer url with filtered blob name", () => {
    expect(
      buildExplorerUrl(
        "0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6",
        "1600x900_Den.png",
      ),
    ).toBe(
      "https://explorer.shelby.xyz/shelbynet/account/0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/blobs?name=1600x900_Den.png",
    );
  });

  it("builds explorer url from full blob key using suffix", () => {
    expect(
      buildExplorerUrl(
        "0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6",
        "@c359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/1600x900_Den.png",
      ),
    ).toBe(
      "https://explorer.shelby.xyz/shelbynet/account/0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6/blobs?name=1600x900_Den.png",
    );
  });

  it("truncates long addresses", () => {
    expect(
      truncateAddress(
        "0xc359c9a4f005c72f2e90e99115fa12c9ee17f445627d48ed8cb282b15b0141f6",
        10,
        6,
      ),
    ).toBe("0xc359c9a4...0141f6");
  });

  it("formats bytes for KB and MB", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(3 * 1024 * 1024)).toBe("3.00 MB");
  });
});
