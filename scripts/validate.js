import FS from 'fs';
import Glob from 'glob';
import YAML from 'js-yaml';
import Path from 'path';
import jsonschema from 'jsonschema';

const validator = new jsonschema.Validator();
let pass = true;

const documentSchema = YAML.safeLoad(FS.readFileSync('./schemas/document.yaml'));
const geoJsonSchema = JSON.parse(FS.readFileSync('./schemas/geo.json'));

const hr = '--------------------------------------------------';

['attractions', 'campsites', 'parks', 'routes'].forEach((category) => {
    Glob.sync(`./public/content/${category}/**/*.*`).forEach((filePath) => {
        const ext = Path.extname(filePath);
        let schema = null;
        let content = null;
        if (ext === '.yaml') {
            schema = documentSchema;
            content = YAML.safeLoad(FS.readFileSync(filePath));
        } else if (ext === '.json') {
            schema = geoJsonSchema;
            content = JSON.parse(FS.readFileSync(filePath));
        } else {
            pass = false;
            console.log(`\n${hr}`);
            console.log(`FILE:\n ${filePath.replace('./public/content/', '')}`);
            console.log('\nERRORS:');
            console.log(` => Unknown file type!`);
            console.log(`${hr}\n`);
        }
        if (content) {
            const result = validator.validate(content, schema, { throwError: false });
            if (result.errors.length === 0) {
                // console.log(`OK: ${filePath}`);
            } else {
                pass = false;
                console.log(`\n${hr}`);
                console.log(`FILE:\n ${filePath.replace('./public/content/', '')}`);
                console.log('\nERRORS:');
                result.errors.forEach((e) =>
                    console.log(' => ', e.stack.replace(/^instance\s+/, '')),
                );
                console.log(hr, '\n');
            }
        }
    });
});

if (pass) {
    console.log('Validation passed OK.');
} else {
    throw new Error('One or more content documents failed validation!');
}
