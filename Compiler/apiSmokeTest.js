const { spawn } = require("child_process");

const tests = [
  {
    language: "java",
    code: "import java.util.*; public class Main { public static void main(String[] args){ Scanner sc = new Scanner(System.in); int a=sc.nextInt(), b=sc.nextInt(); System.out.println(a+b); } }",
    input: "2 3",
  },
  {
    language: "js",
    code: 'const fs=require("fs"); const [a,b]=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number); console.log(a+b);',
    input: "2 3",
  },
  {
    language: "py",
    code: "a,b=map(int,input().split())\nprint(a+b)",
    input: "2 3",
  },
  {
    language: "go",
    code: 'package main\nimport "fmt"\nfunc main(){var a,b int; fmt.Scan(&a,&b); fmt.Println(a+b)}',
    input: "2 3",
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = (server) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Server did not start in time."));
    }, 10000);

    const onStdout = (chunk) => {
      if (chunk.toString().includes("Server is listening on port")) {
        cleanup();
        resolve();
      }
    };

    const onExit = (code) => {
      cleanup();
      reject(new Error(`Server exited early with code ${code}.`));
    };

    const cleanup = () => {
      clearTimeout(timer);
      server.stdout.off("data", onStdout);
      server.off("exit", onExit);
    };

    server.stdout.on("data", onStdout);
    server.on("exit", onExit);
  });

const run = async () => {
  const server = spawn(process.execPath, ["Index.js"], {
    cwd: __dirname,
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(server);

    for (const test of tests) {
      const response = await fetch("http://127.0.0.1:7000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test),
      });

      console.log(
        JSON.stringify({
          language: test.language,
          status: response.status,
          body: await response.text(),
        })
      );
    }
  } finally {
    server.kill("SIGTERM");
    await sleep(500);
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
