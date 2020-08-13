const path = require('path');
const fs = require('fs');
const { getAST, getDependencies, transform } = require('./parser');

module.exports = class Compiler{
    constructor(options){
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }
    run(){
        const entryModule = this.buildModule(this.entry, true)
        this.modules.push(entryModule);
        this.modules.forEach(module => {
            module.dependencies.forEach(depency => {
                this.modules.push(this.buildModule(depency));
            })
        })
        console.log(this.modules);
        this.emitFile();
    }
    buildModule(filename, isEntry){
        let ast = null;
        if(isEntry) {
            ast = getAST(filename);
        }else{
            const absolutePath = path.join(process.cwd(), './src', filename);
            ast = getAST(absolutePath);
        }
        return {
            filename,
            dependencies: getDependencies(ast),
            source: transform(ast)
        }
    }
    emitFile(){
        const outputPath = path.join(this.output.path, this.output.filename);
        let modules = '';
        this.modules.forEach(_module => {
            modules += `'${_module.filename}': function(require,module, exports){
                ${_module.source}
            },`
        })
        
        const content = `void function(modules){
            function require(filename){
               const fn = modules[filename];
               const module = { exports: {} }
               fn(require, module, module.exports )
               return module.exports;
            }
            require('${this.entry}')
         }({${modules}})`;
        fs.writeFileSync(outputPath, content, 'utf-8');
    }
}