const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

try {

  const page_content = fs.readFileSync(path.resolve(__dirname, 'target.css'), { encoding: 'utf-8' });
  const lines = page_content.split('\n');

  const structure = lines.map(line => {

    const class_name = line.split(' {')[0].trim();
    const content_describer = line.split('/*')[1].split('*/')[0].trim();
    const content_code = line.split('{ ')[1].split(' }')[0].trim();

    return { class_name, content_describer, content_code }

  });

  let duplicated_class_names = [];
  let duplicated_content_code = [];

  const validate_document_structure = () => {

    const all_class = structure.map(val => val.class_name);
    const duplicated_values = all_class.filter((val, index) => all_class.indexOf(val) < index);

    if (duplicated_values.length) duplicated_class_names = duplicated_values;

    const code_content = structure.map(val => val.content_code);
    const dubplicated_content = code_content.filter((val, index) => code_content.indexOf(val) < index);

    if (dubplicated_content.length) duplicated_content_code = dubplicated_content;

  }

  validate_document_structure();

  if (duplicated_class_names.length) throw { message: `you have duplicated class name(s): ${duplicated_class_names.join(' - ')}` }
  if (duplicated_content_code.length) throw { message: `you have duplicated stylesheet code(s): ${duplicated_content_code.join(' - ')}` }

  let document_content = '| Class name | Description | Stylesheet Code | \n'
  document_content += '| ------ | ----- | ----- | \n';

  for (const line of structure) {

    document_content += `| ${line.class_name} |`;
    document_content += ` ${line.content_describer} |`;
    document_content += ` ${line.content_code} | \n`;

  }

  fs.writeFileSync(path.resolve(__dirname, 'README.md'), document_content);

  execSync(`git add . && git commit -m ${Date.now()} && git push`);

} catch (error) { console.log('ERROR: '+error.message) }