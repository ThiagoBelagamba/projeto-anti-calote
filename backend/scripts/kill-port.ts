import { execSync } from "child_process";

const port = process.argv[2] || process.env.PORT || "3333";

function killPortWindows(p: string): void {
  const output = execSync(`netstat -ano | findstr :${p}`, { encoding: "utf-8" });
  const pids = new Set<string>();

  for (const line of output.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && pid !== "0") pids.add(pid);
  }

  if (pids.size === 0) {
    console.log(`Nenhum processo na porta ${p}`);
    return;
  }

  for (const pid of pids) {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit" });
    console.log(`Processo ${pid} encerrado (porta ${p})`);
  }
}

try {
  if (process.platform === "win32") {
    killPortWindows(String(port));
  } else {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "inherit", shell: true });
    console.log(`Porta ${port} liberada`);
  }
} catch {
  console.log(`Porta ${port} já está livre`);
}
