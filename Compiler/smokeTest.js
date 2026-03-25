const { generateFile } = require("./generateFile");
const { generateInputFile } = require("./generateInputFile");
const { executeC } = require("./executeC");
const { executeCpp } = require("./executeCpp");
const { executeGo } = require("./executeGo");
const { executeJava } = require("./executeJava");
const { executeJs } = require("./executeJs");
const { executePython } = require("./executePython");

const cases = [
  {
    language: "c",
    executor: executeC,
    code: '#include <stdio.h>\nint main(){int a,b; if(scanf("%d %d", &a, &b)!=2) return 1; printf("%d\\n", a+b); return 0;}',
    input: "2 3\n",
  },
  {
    language: "cpp",
    executor: executeCpp,
    code: '#include <iostream>\nusing namespace std; int main(){int a,b; if(!(cin>>a>>b)) return 1; cout << a+b << "\\n";}',
    input: "2 3\n",
  },
  {
    language: "javascript",
    executor: executeJs,
    code: 'const fs=require("fs"); const [a,b]=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number); console.log(a+b);',
    input: "2 3\n",
  },
  {
    language: "python",
    executor: executePython,
    code: "a, b = map(int, input().split())\nprint(a + b)",
    input: "2 3\n",
  },
  {
    language: "go",
    executor: executeGo,
    code: 'package main\nimport "fmt"\nfunc main(){var a,b int; fmt.Scan(&a,&b); fmt.Println(a+b)}',
    input: "2 3\n",
  },
  {
    language: "java",
    executor: executeJava,
    code: "import java.util.*; public class Main { public static void main(String[] args){ Scanner sc = new Scanner(System.in); int a=sc.nextInt(), b=sc.nextInt(); System.out.println(a+b); } }",
    input: "2 3\n",
  },
];

(async () => {
  let failed = false;

  for (const testCase of cases) {
    try {
      const filePath = await generateFile(testCase.language, testCase.code);
      const inputPath = await generateInputFile(testCase.input);
      const output = await testCase.executor(filePath, inputPath);
      console.log(
        JSON.stringify({
          language: testCase.language,
          ok: true,
          output: output.trim(),
        })
      );
    } catch (error) {
      failed = true;
      console.log(
        JSON.stringify({
          language: testCase.language,
          ok: false,
          error: error.message || error.error || String(error),
          stderr: error.stderr || "",
        })
      );
    }
  }

  process.exit(failed ? 1 : 0);
})();
