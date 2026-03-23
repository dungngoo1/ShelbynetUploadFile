export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
}
