import http from "node:http";
import { access } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import net from "node:net";

const repoRoot = process.cwd();
const requestedProject = normalizeProjectName(process.argv[2]);

if (!requestedProject) {
  console.error("Usage: npm run serve -- <project-folder>");
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(requestedProject)) {
  console.error(
    "Project folders must use a URL-safe lowercase name with letters, digits, and hyphens only."
  );
  process.exit(1);
}

const projectDir = path.join(repoRoot, requestedProject);
const indexFile = path.join(projectDir, "index.html");

await ensurePath(projectDir, `Project folder not found: ${requestedProject}`);
await ensurePath(indexFile, `Missing index.html in project folder: ${requestedProject}`);

const serverBin = process.platform === "win32"
  ? path.join(repoRoot, "node_modules", ".bin", "http-server.cmd")
  : path.join(repoRoot, "node_modules", ".bin", "http-server");

await ensurePath(
  serverBin,
  "http-server is not installed yet. Run `npm install` in the repo root first."
);

const port = await findOpenPort(8080, 20);
const url = `http://127.0.0.1:${port}/${requestedProject}/`;
const server = spawn(serverBin, [".", "-a", "127.0.0.1", "-p", String(port), "-c-1"], {
  cwd: repoRoot,
  stdio: "inherit"
});

let shuttingDown = false;

server.on("error", (error) => {
  console.error(`Failed to start preview server: ${error.message}`);
  process.exit(1);
});

server.on("exit", (code) => {
  process.exit(code ?? 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    server.kill(signal);
  });
}

try {
  await waitForServer(url, 20000);
  console.log(`Opening ${url}`);
  openBrowser(url);
} catch (error) {
  console.error(`Server did not become ready in time: ${error.message}`);
  server.kill("SIGTERM");
  process.exit(1);
}

function normalizeProjectName(value) {
  if (!value) {
    return "";
  }

  return value.trim().replace(/\\/g, "/").replace(/^\.?\//, "").replace(/\/$/, "");
}

async function ensurePath(targetPath, message) {
  try {
    await access(targetPath);
  } catch {
    console.error(message);
    process.exit(1);
  }
}

async function findOpenPort(startPort, attempts) {
  for (let offset = 0; offset < attempts; offset += 1) {
    const port = startPort + offset;
    const isOpen = await canBindToPort(port);

    if (isOpen) {
      return port;
    }
  }

  console.error(`Could not find an open port between ${startPort} and ${startPort + attempts - 1}.`);
  process.exit(1);
}

function canBindToPort(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.unref();

    probe.once("error", () => {
      resolve(false);
    });

    probe.listen(port, "127.0.0.1", () => {
      probe.close(() => resolve(true));
    });
  });
}

function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error("Timed out waiting for the preview server."));
          return;
        }

        setTimeout(attempt, 250);
      });
    };

    attempt();
  });
}

function openBrowser(url) {
  if (process.platform === "win32" || process.env.WSL_DISTRO_NAME) {
    spawn("cmd.exe", ["/c", "start", "", url], {
      detached: true,
      stdio: "ignore"
    }).unref();
    return;
  }

  if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    return;
  }

  spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
}