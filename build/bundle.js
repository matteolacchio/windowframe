const config = require('./config/webpack.bundle.js');
const fs = require('fs');
const package = require('../package.json');
const path = require('path');
const webpack = require('webpack');

const dist_directory = path.resolve(__dirname, '../dist');

new Promise((resolve, reject) => {
    if(fs.existsSync(dist_directory)){
        console.log('Cleaning up previous dist directory');
        fs.rm(dist_directory, { recursive: true }, (error) => error ? reject(error) : resolve());
    }else{
        resolve();
    }    
}).then(() => new Promise((resolve, reject) => {
    console.log('Starting webpack');
    webpack(config).run((error, result) => (error) ? reject(error) : resolve(result));
})).then(() => new Promise((resolve, reject) => {
    console.log('Generating package.json');
    const allowed_fields = [
        'name', 
        'version', 
        'description', 
        'repository', 
        'author', 
        'license', 
        'bugs', 
        'homepage',
        'keywords'
    ];
    Object.keys(package).forEach((field) => { if(allowed_fields.indexOf(field) < 0) delete package[field] });
    fs.writeFile(
        path.resolve(dist_directory, 'package.json'), 
        JSON.stringify(package),
        (error) => error ? reject(error) : resolve()
    );
})).then(() => new Promise((resolve, reject) => {
    console.log('Generating README.md');
    fs.copyFile(
        path.resolve(__dirname, '../README.md'),
        path.resolve(dist_directory, 'README.md'),
        (error) => error ? reject(error) : resolve()
    )
})).catch((ex) => {
    console.error(ex);
}).finally(() => {
    console.log('Build done');
});










