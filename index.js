const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');

const page_content = fs.readFileSync(path.resolve(__dirname, 'target.css'), { encoding: 'utf-8' });
const lines = page_content.split('\n');

const structure = lines.map(line => {

  const class_name = line.split(' {')[0].trim();
  const content_describer = line.split('/*')[1].split('*/')[0].trim();
  const content_code = line.split('{ ')[1].split(' }')[0].trim();

  return { class_name, content_describer, content_code }

});

let document_content = '| Class name | Description | Stylesheet Code | \n'
document_content += '| ------ | ----- | ----- | \n';

for(const line of structure) {

  document_content += `| ${line.class_name} |`;
  document_content += ` ${line.content_describer} |`;
  document_content += ` ${line.content_code} | \n`;

}

fs.writeFileSync(path.resolve(__dirname, 'framework_docs.md'), document_content);

execSync('git add .');
execSync('git commit -m '+Date.now());
execSync('git push');