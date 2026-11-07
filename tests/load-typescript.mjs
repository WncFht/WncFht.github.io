import {readFile} from 'node:fs/promises';
import {transpileModule, ModuleKind, ScriptTarget} from 'typescript';

// Run the pure TS helpers on the project's supported Node versions, without a test framework.
export async function loadTypeScript(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  const {outputText} = transpileModule(source, {
    compilerOptions: {module: ModuleKind.ESNext, target: ScriptTarget.ES2022},
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
