export async function extractText(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      if (file.type === "text/plain") {
        resolve(new TextDecoder().decode(e.target.result).slice(0, 5000));
        return;
      }
      // Simple regex-based PDF/Binary text extraction (as in original code)
      const raw = new TextDecoder("latin1").decode(new Uint8Array(e.target.result));
      const m = raw.match(/\(([^)]{2,200})\)/g) || [];
      resolve(m.map(x => x.slice(1, -1)).filter(x => /[a-zA-Z]{3,}/.test(x)).join(" ").slice(0, 5000));
    };
    reader.readAsArrayBuffer(file);
  });
}
