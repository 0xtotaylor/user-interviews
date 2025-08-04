import { Export } from "@/types";

export const handleExport = async ({
  path,
  interviews,
  newTab = false,
  defaultFileName = "Export",
}: Export) => {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(interviews),
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const contentDisposition =
      response.headers.get("Content-Disposition") || "";
    let fileName = defaultFileName;
    const filenameRegex = /filename="(.+)"/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches && matches[1]) {
      fileName = matches[1];
    }

    if (newTab) {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      URL.revokeObjectURL(blobUrl);
    } else {
      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(urlBlob);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    throw err;
  }
};
